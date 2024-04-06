from flask import Flask,request, redirect, url_for,jsonify
import os
import cv2
from ocr_core import ocr_core
from flask.helpers import send_from_directory
from flask_cors import CORS, cross_origin
from keras.models import Model, load_model
from werkzeug.utils import secure_filename
from tensorflow.keras.preprocessing.image import load_img,img_to_array
import numpy as np


UPLOAD_FOLDER = '/static/uploads/'
new_model=load_model('rottenvsfresh.h5')
classimodel = load_model('FruitModel.h5')
labels ={0: ['apple', 60],
 1: ['banana',7],
 2: ['beetroot', 10],
 3: ['bell pepper', 14],
 4: ['cabbage', 30],
 5: ['capsicum', 14],
 6: ['carrot', 60],
 7: ['cauliflower', 7],
 8: ['chilli pepper',12],
 9: ['corn', 4],
 10: ['cucumber', 12],
 11: ['eggplant', 12],
 12: ['garlic', 21],
 13: ['ginger', 30],
 14: ['grapes',14],
 15: ['jalepeno', 7],
 16: ['kiwi', 14],
 17: ['lemon', 14],
 18: ['lettuce', 10],
 19: ['mango', 7],
 20: ['onion', 90],
 21: ['orange', 14],
 22: ['paprika', 180],
 23: ['pear', 14],
 24: ['peas', 10],
 25: ['pineapple', 7],
 26: ['pomegranate',60],
 27: ['potato', 120],
 28: ['raddish',14],
 29: ['soy beans',7],
 30: ['spinach', 12],
 31: ['sweetcorn', 7],
 32: ['sweetpotato', 90],
 33: ['tomato',7],
 34: ['turnip', 14],
 35: ['watermelon', 8]} 

# allow files of a specific type
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

app = Flask(__name__, static_folder='inventory/build', static_url_path='')
CORS(app)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def load_single_image(image_path):
    img = cv2.imread(image_path)
    img = cv2.resize(img, (100, 100))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    return img

def output(location):
    img=load_img(location,target_size=(224,224,3))
    img=img_to_array(img)
    img=img/255
    img=np.expand_dims(img,[0])
    answer=classimodel.predict(img)
    y_class = answer.argmax(axis=-1)
    y = " ".join(str(x) for x in y_class)
    y = int(y)
    res = labels[y]
    return res

@app.route('/api', methods=['GET'])
@cross_origin()
def index():
    return {
        "tutorial": "Flask React Heroku"
   }


#@app.route('/', methods=['GET', 'POST'])
#def serve():
#    return send_from_directory(app.static_folder, 'index.html')

@app.route('/', methods=['GET', 'POST'])
def serve1():
    if request.method == 'POST':
        # check if there is a file in the request
        if 'file' not in request.files:
            return send_from_directory(app.static_folder, 'index.html')
        file = request.files['file']
        # if no file is selected
        if file.filename == '':
            return send_from_directory(app.static_folder, 'index.html')

        if file and allowed_file(file.filename):

            # call the OCR function on it
            extracted_text = ocr_core(file)

            # extract the text and display it
            return jsonify({"msg": "Successfully processed", "extracted_text": extracted_text})
            #return redirect(url_for('index', msg='Successfully processed', extracted_text=extracted_text, img_src=url_for('static', filename=file.filename)))
    elif request.method == 'GET':
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/pred', methods=['GET', 'POST'])
def serve():
    if request.method == 'POST':
        # check if there is a file in the request
        if 'file1' not in request.files:
            return send_from_directory(app.static_folder, 'index.html')
        file = request.files['file1']
        # if no file is selected
        if file.filename == '':
            return send_from_directory(app.static_folder, 'index.html')

        if file and allowed_file(file.filename):
            basepath = os.path.dirname(__file__)
            file_path = os.path.join(basepath, 'uploads', secure_filename(file.filename))
            file.save(file_path)
            # call the OCR function on it
            image = load_single_image(file_path)
            extracted_text1 = format(float(new_model.predict(image.reshape(1,100,100,3))[0][0]), '.20f')
            extracted_text2 = output(file_path)
            extracted_text = extracted_text2[0] + ', ' + str(int((1 - float(extracted_text1)) * float(extracted_text2[1])))
            # extract the text and display it
            return jsonify({"msg1": "Successfully processed", "extracted_text1": extracted_text})
    elif request.method == 'GET':
        return send_from_directory(app.static_folder, 'index.html')  

def uploaded_file(filename):
    # Serve the uploaded file from the UPLOAD_FOLDER directory
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run()