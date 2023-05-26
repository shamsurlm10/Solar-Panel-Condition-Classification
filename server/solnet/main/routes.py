from io import BytesIO

import numpy as np
import pandas as pd
import tensorflow as tf
from flask import request
from flask_restful import Resource, fields, marshal_with
from PIL import Image
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

resource_fields = {
    'label':   fields.String,
    'power':   fields.Float,
}


class SolnetDao(object):
    def __init__(self, label, power) -> None:
        self.label = label
        self.power = power


MODEL = tf.keras.models.load_model('./training/save_model.h5')
CLASS_NAMES = ['clean', 'dust', 'shadow', 'waterdrop']

df = pd.read_csv("./solnet/main/metadatav2.csv")

X = df[['lebel', 'time', 'LUX', 'TEMP (Celcius)']]
y = df['power']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

rfr = RandomForestRegressor(n_estimators=100)
rfr.fit(X_train, y_train)
y_pred = rfr.predict(X_test)


def power_regression_prediction(lebel, time, lux, temp):
    user_input = [[lebel, time, lux, temp]]
    user_input = scaler.transform(user_input)
    power_prediction = rfr.predict(user_input)
    return power_prediction[0]


def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image


def numberWithoutRounding(num, precision=4):
    [beforeDecimal, afterDecimal] = str(num).split('.')
    return float(beforeDecimal + '.' + afterDecimal[0:precision])


class Solnet(Resource):
    @marshal_with(resource_fields)
    def post(self):
        file = request.files.get('file')

        try:
            time = int(request.form.get('time'))
            lux = int(request.form.get('lux'))
            temp = float(request.form.get('temp'))
        except:
            return SolnetDao(label=None, power=0)

        if not file:
            return SolnetDao(label=None, power=0)

        image = read_file_as_image(file.read())
        image = Image.fromarray(image.astype('uint8'), 'RGB')
        image = image.resize((256, 256))
        image_array = np.array(image) / 255.0
        image_array = np.expand_dims(image_array, axis=0)
        class_names = ['clean', 'dust', 'shadow', 'waterdrop']
        label_prediction = MODEL.predict(image_array)
        label = np.argmax(label_prediction)

        power_prediction = power_regression_prediction(label, time, lux, temp)
        return SolnetDao(label=class_names[label], power=numberWithoutRounding(power_prediction))
