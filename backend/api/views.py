from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import StockPredictionSerializer
from rest_framework.response import Response    
from rest_framework import status
import yfinance as yf
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime
import os
from django.conf import settings
from .utils import save_plot
from sklearn.preprocessing import MinMaxScaler
from keras.models import load_model
from sklearn.metrics import mean_squared_error,r2_score
# Create your views here.

class StockPredictionView(APIView):
    def post(self, request):
       serializer = StockPredictionSerializer(data=request.data)
       if serializer.is_valid():
              ticker = serializer.validated_data['ticker']

              #fetch the data from yfinance
              now=datetime.now()
              start= datetime(now.year-10, now.month, now.day)
              end=now
              df=yf.download(ticker, start, end)
              
              if df.empty:
                  return Response({'error':'Invalid ticker symbol or no data found.'}, status=status.HTTP_400_BAD_REQUEST)
              df=df.reset_index()
              # Generate Basic Plot
              plt.switch_backend('AGG')  # Use a non-interactive backend 
              plt.figure(figsize=(12,5))
              plt.plot(df.Close,label='Closing Price')
              plt.title(f'{ticker} Closing Price History')
              plt.xlabel('Days')
              plt.ylabel('Price')
              plt.legend()
              #save the plot to a file
              plot_img_path=f'{ticker}_plot.png'
              plot_img=save_plot(plot_img_path)
             
              #100 Days moving average
              ma100=df.Close.rolling(100).mean()
              plt.switch_backend('AGG')  # Use a non-interactive backend 
              plt.figure(figsize=(12,5))
              plt.plot(df.Close,label='Closing Price')
              plt.plot(ma100,'r',label='100 Days Moving Average')
              plt.title(f'100 days Moving Average of {ticker}')
              plt.xlabel('Days')
              plt.ylabel('Price')
              plt.legend()
              plot_img_path=f'{ticker}_100_dma_plot.png'
              plot_100_dma=save_plot(plot_img_path)

              #200 Days moving average
              ma200=df.Close.rolling(200).mean()        
              plt.switch_backend('AGG')  # Use a non-interactive backend
              plt.figure(figsize=(12,5))
              plt.plot(df.Close,label='Closing Price')
              plt.plot(ma100,'r',label='100 Days Moving Average')
              plt.plot(ma200,'g',label='200 Days Moving Average')
              plt.title(f'200 days Moving Average of {ticker}')
              plt.xlabel('Days')
              plt.ylabel('Price')
              plt.legend()
              plot_img_path=f'{ticker}_200_dma_plot.png'
              plot_200_dma=save_plot(plot_img_path)
             
              # Splitting data into training & testing datasets
              data_training=pd.DataFrame(df.Close[0:int(len(df)*0.7)])
              data_testing=pd.DataFrame(df.Close[int(len(df)*0.7):int(len(df))])  

              #Scaling the data between 0 and 1 \
              scaler=MinMaxScaler(feature_range=(0,1))
              

              #load ML Model
              model=load_model('stock_prediction_model.keras')

              #Preparing Test Data
              past_100_days=data_training.tail(100)
              final_df=pd.concat([past_100_days,data_testing],ignore_index=True)
              input_data=scaler.fit_transform(final_df)

              x_test=[]
              y_test=[]

              for i in range(100,input_data.shape[0]):
                x_test.append(input_data[i-100:i])
                y_test.append(input_data[i,0])

              x_test,y_test=np.array(x_test),np.array(y_test)


              #Making Predictions
              y_predicted=model.predict(x_test)

              #Revert The Scale Price to Original price 
              y_predicted=scaler.inverse_transform(y_predicted.reshape(-1,1)).flatten()
              y_test=scaler.inverse_transform(y_test.reshape(-1,1)).flatten()

              print('y_predicted:',y_predicted)
              print ('y_test:',y_test)

              #plot the final Prediction
              plt.switch_backend('AGG')  # Use a non-interactive backend
              plt.figure(figsize=(12,5))
              plt.plot(y_test,'b',label='Original Price')
              plt.plot(y_predicted,'r',label='Predicted Price')
              plt.title(f'Final Prediction For {ticker}')
              plt.xlabel('Days')
              plt.ylabel('Price')
              plt.legend()
              plot_img_path=f'{ticker}_final_prediction_.png'
              plot_final_prediction=save_plot(plot_img_path)
            

              #Model Evaluation 

              #Mean Squared Error (MSE)
              mse=mean_squared_error(y_test,y_predicted)

              #Root Mean Squared Error (RMSE)
              rmse=np.sqrt(mse)

              #R squared (R2) Score
              r2=r2_score(y_test,y_predicted)

              return Response(
                   {'status':'success',
                     'plot_img': plot_img
                        ,'plot_100_dma':plot_100_dma,
                        'plot_200_dma':plot_200_dma,
                        'plot_final_prediction':plot_final_prediction,
                        'mse':mse,
                        'rmse':rmse,    
                        'r2_score':r2
                     }
                    )
              # Placeholder for prediction logic
              