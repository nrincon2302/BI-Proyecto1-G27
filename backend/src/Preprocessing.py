import json
import pandas as pd
import unicodedata
from num2words import num2words
from nltk.corpus import stopwords
from nltk import word_tokenize
from nltk.stem import SnowballStemmer, WordNetLemmatizer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import FunctionTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib
import re  # <- Importar re para expresiones regulares

# Descargar datos necesarios de nltk
import nltk
#nltk.download('punkt')
#nltk.download('stopwords')

stopwords_es = stopwords.words('spanish')

# Mapeo de caracteres mal representados a sus correspondientes en español
replacement_map = {
    'Ã¡': 'á',
    'Ã©': 'é',
    'Ã­': 'í',
    'Ã³': 'ó',
    'Ãº': 'ú',
    'Ã±': 'ñ',
    'Ã‘': 'Ñ',
    'Â¡': '¡',
    'Â¿': '¿',
    'Â´': '´',
    'â€œ': '“',
    'â€': '”',
    'â€˜': '‘',
    'â€™': '’',
    'â€¢': '•'
}

# Cargar el archivo de datos
data = pd.read_excel("data/ODScat_345.xlsx")

# Verificar columnas disponibles en los datos
print(data.columns)

# Definir X_train con las columnas correctas ('Textos_espanol' y 'sdg')
X_train = data[['Textos_espanol', 'sdg']]

def correct_encoding_errors(text):
    """Correct common encoding errors in a given text"""
    for wrong, right in replacement_map.items():
        text = text.replace(wrong, right)
    return text

def remove_non_ascii(words):
    """Remove non-ASCII characters from list of tokenized words"""
    new_words = []
    for word in words:
        new_word = unicodedata.normalize('NFKD', word).encode('latin1', errors='ignore').decode('utf-8', errors='ignore')
        new_words.append(new_word)
    return new_words

def to_lowercase(words):
    """Convert all characters to lowercase from list of tokenized words"""
    new_words = []
    for word in words:
        new_word = word.lower()
        new_words.append(new_word)
    return new_words

def remove_punctuation(words):
    """Remove punctuation from list of tokenized words"""
    new_words = []
    for word in words:
        new_word = re.sub(r'[^\w\s]', '', word)
        if new_word != '':
            new_words.append(new_word)
    return new_words

def replace_numbers(words):
    """Replace all interger occurrences in list of tokenized words with textual representation"""
    new_words = []
    for word in words:
        # Check if the word is a percentage
        if word.endswith('%'):
            try:
                # Remove the % sign and convert the number to words
                number = float(word[:-1].replace(',', '.'))
                new_word = num2words(number, lang='es') + ' por ciento'
            except ValueError:
                new_word = word
            new_words.append(new_word)
        # Check if the word is a digit (integer)
        elif word.isdigit():
            new_word = num2words(word, lang='es')
            new_words.append(new_word)
        else:
            new_words.append(word)
    return new_words

def remove_stopwords(words, stopwords=stopwords_es):
    """Remove stop words from list of tokenized words"""
    new_words = []
    for word in words:
        if word not in stopwords:
            new_words.append(word)
    return new_words

def preprocessing(words):
    text = ' '.join(words)
    text = correct_encoding_errors(text)
    words = text.split()
    words = to_lowercase(words)
    words = replace_numbers(words)
    words = remove_punctuation(words)
    words = remove_non_ascii(words)
    words = remove_stopwords(words)
    return words

def stem_words(words):
    """Stem words in list of tokenized words"""
    stemmer = SnowballStemmer('spanish')
    stems = []
    for word in words:
        stem = stemmer.stem(word)
        stems.append(stem)
    return stems

def lemmatize_verbs(words):
    """Lemmatize verbs in list of tokenized words"""
    lemmatizer = WordNetLemmatizer()
    lemmas = []
    for word in words:
        lemma = lemmatizer.lemmatize(word, pos='v')
        lemmas.append(lemma)
    return lemmas

def stem_and_lemmatize(words):
    stems = stem_words(words)
    lemmas = lemmatize_verbs(words)
    return stems + lemmas

# Preprocesamiento de los datos
def pipeline_datos(df: pd.DataFrame):
    # Realizar una copia del conjunto de datos
    df_pipeline = df.copy()

    # Renombrar las columnas para que sean más descriptivas
    df_pipeline.rename(columns={'Textos_espanol': 'Textos'}, inplace=True)

    # Aplicar el preprocesamiento
    df_pipeline['words'] = df_pipeline['Textos'].apply(word_tokenize).apply(preprocessing)
    df_pipeline['words'] = df_pipeline['words'].apply(stem_and_lemmatize)
    df_pipeline['words'] = df_pipeline['words'].apply(lambda x: ' '.join(map(str, x)))

    return df_pipeline['words']

# Crear el pipeline con preprocesamiento y modelo de clasificación
#pipeline = Pipeline([
#    ('preprocesamiento', FunctionTransformer(pipeline_datos)),
#    ('tfidf', TfidfVectorizer(max_features=10000)),
#    ('clf', LogisticRegression(C=100, max_iter=100, multi_class='multinomial', solver='newton-cg'))
#])

# Entrenar el pipeline con los datos (X_train['Textos_espanol']) y las etiquetas (X_train['sdg'])
#pipeline.fit(X_train.drop(columns=['sdg']), X_train['sdg'])

# Guardar el pipeline entrenado en un archivo
#joblib.dump(pipeline, 'backend/src/assets/pipeline_funcional.joblib')



def pipeline_datos_reentrenamiento(df):
    # Verificar si 'df' es una Serie y convertirla en DataFrame
    if isinstance(df, pd.Series):
        df_pipeline = df.to_frame(name='Textos_espanol')
    elif isinstance(df, pd.DataFrame):
        df_pipeline = df.copy()
    else:
        raise ValueError("El input debe ser un DataFrame o Series.")
    
    # Renombrar las columnas para que sean más descriptivas
    df_pipeline.rename(columns={'Textos_espanol': 'Textos'}, inplace=True)
    
    # Aplicar el preprocesamiento
    df_pipeline['words'] = df_pipeline['Textos'].apply(word_tokenize).apply(preprocessing)
    df_pipeline['words'] = df_pipeline['words'].apply(stem_and_lemmatize)
    df_pipeline['words'] = df_pipeline['words'].apply(lambda x: ' '.join(map(str, x)))

    return df_pipeline['words']
