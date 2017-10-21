#importing required module


from flask import Flask
from flask import render_template
from pymongo import MongoClient
import matplotlib.pylab as plt
from sklearn import preprocessing
from sklearn.model_selection import  train_test_split
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from scipy.spatial.distance import cdist
from sklearn import manifold
from sklearn.metrics import euclidean_distances
from sklearn.metrics import pairwise_distances
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import LabelEncoder

from subprocess import check_output
#print(check_output(["ls", "../input"]).decode("utf8"))

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

##### Plotly modules #####
import plotly
from plotly import __version__
from plotly.offline import download_plotlyjs, init_notebook_mode, plot, iplot
import plotly.graph_objs as go
from plotly.graph_objs import Scatter, Figure, Layout, Choropleth


import collections
from pandas import DataFrame


app = Flask(__name__)
MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'HomicideDB'
COLLECTION_NAME = 'Murders'
FIELDS = {'Record ID': True, 'Agency Code': True, 'Agency Name': True, 'Agency Type': True, 'City': True,'State': True,'Year': True,'Month': True,'Incident':True,'Crime Type':True,
          'Crime Solved':True,'Victim Sex':True,'Victim Age':True,'Victim Race':True,'Victim Ethnicity':True,'Perpetrator Sex':True,'Perpetrator Age':True,'Perpetrator Race':True
          ,'Perpetrator Ethnicity':True,'Relationship':True,'Weapon':True,'Victim Count':True,'Perpetrator Count':True}
np.set_printoptions(suppress=True)
decimated_data = []
raw_data = ''
convertedData = ''
us_state_abbrev = {
    'Alabama': 'AL',
    'Alaska': 'AK',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Pennsylvania': 'PA',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY',
}
@app.route("/")
def hello_world():

    return render_template("/pages/charts/chartjs.html")
@app.route("/random")
def random_sampling():

    return render_template("index.html")
@app.route("/nationalHC")
def national_homicide_count():
    return render_template("/pages/charts/nationalHC.html")

@app.route("/PC")
def parallel_coordinates_graph():
    return render_template("/pages/charts/parallel_coordinates.html")

@app.route("/PCA")
def pca_graphs():
    return render_template("/pages/charts/pca.html")


def convertToNumeric_HeatMap(dataframe):
    le = preprocessing.LabelEncoder()
    le.fit(dataframe.Perpetrator_Sex)
    dataframe.loc[:, 'Perpetrator_Sex'] = le.transform(dataframe.Perpetrator_Sex)
    le1 = preprocessing.LabelEncoder()
    le1.fit(dataframe.Weapon)
    dataframe.loc[:, 'Weapon'] = le1.transform(dataframe.Weapon)
    return dataframe

def convertToNumeric_HeatMap2(dataframe):
    le = preprocessing.LabelEncoder()
    le.fit(dataframe.Victim_Sex)
    dataframe.loc[:, 'Victim_Sex'] = le.transform(dataframe.Victim_Sex)
    le1 = preprocessing.LabelEncoder()
    le1.fit(dataframe.Weapon)
    dataframe.loc[:, 'Weapon'] = le1.transform(dataframe.Weapon)
    return dataframe

def prepareDataForParallelCoordinates(data_clean):
    rows = np.random.choice(data_clean.index.values, 500)
    data_clean = data_clean.ix[rows]
    data_clean = data_clean[['Year', 'Month', 'Incident','Victim_Age','Perpetrator_Age','Weapon']]
    le14 = preprocessing.LabelEncoder()
    le14.fit(data_clean.Weapon)
    data_clean.loc[:, 'Weapon'] = le14.transform(data_clean.Weapon)
    le15 = preprocessing.LabelEncoder()
    le15.fit(data_clean.Month)
    data_clean.loc[:, 'Month'] = le15.transform(data_clean.Month)
    data_clean.to_csv("static/" + "PCData.csv", ",", index_label=True, index=False)



def prepareData(df):
    df['state'] = df['State'].map(us_state_abbrev)

    df['Full Date'] = pd.to_datetime((str(15) + '-' + df['Month'] + '-' + df['Year'].astype(str)), format='%d-%B-%Y')
    df['Weapon Type'] = df['Weapon'].apply(
        lambda x: 'Gun' if x in ['Rifle', 'Firearm', 'Shotgun', 'Handgun', 'Gun'] else 'Other')
    df.loc[df['Perpetrator_Age'] == " ", 'Perpetrator_Age'] = 0
    df['Perpetrator_Age'] = df['Perpetrator_Age'].astype(int)

    df1 = df.groupby(['Full Date'], as_index=False)['Incident'].sum()
    x = df1['Full Date']
    y = df1['Incident']
    df1.columns = ['Date', 'Incident']
    df1.to_csv("static/" + "HomicideCount.csv", ",", index_label=False, index=False)
    f1, ax1 = plt.subplots()
    ax1 = plt.plot(x, y)
    f1.suptitle('National Homicide Counts')

    df2 = df.groupby(['Full Date', 'Year', 'State', 'state'], as_index=False)['Incident'].sum()

    f2, ax2 = plt.subplots()
    for state in df2['State'].unique():
        x = df2[df2['State'] == state]['Full Date']
        y = df2[df2['State'] == state]['Incident']
        ax2.plot(x, y, label=state)
    ax2.legend(loc='center left', bbox_to_anchor=(1, 0.5))



    df4 = df.groupby(['Perpetrator_Sex', 'Weapon'])['Incident'].sum().reset_index()
    df4['pc'] = df4.groupby('Perpetrator_Sex')['Incident'].apply(lambda x: 100 * x / x.sum())
    df4 = convertToNumeric_HeatMap(df4)
    df4.to_csv("static/" + "Heatmap.csv", ",", index_label=False, index=False)

    df5 = df.groupby(['Victim_Sex', 'Weapon'])['Incident'].sum().reset_index()
    df5['pc'] = df5.groupby('Victim_Sex')['Incident'].apply(lambda x: 100 * x / x.sum())
    df5 = convertToNumeric_HeatMap2(df5)
    df5.to_csv("static/" + "HeatmapVictim.csv", ",", index_label=False, index=False)


    df5 = df.groupby(['State', 'state', 'Weapon Type'])['Incident'].sum().reset_index()
    df5['pc'] = df5.groupby('State')['Incident'].apply(lambda x: 100 * x / x.sum())
    scl = [[0.0, 'rgb(242,240,247)'], [0.2, 'rgb(218,218,235)'], [0.4, 'rgb(188,189,220)'], [0.6, 'rgb(158,154,200)'],
           [0.8, 'rgb(117,107,177)'], [1.0, 'rgb(84,39,143)']]
    data = [dict(
        type='choropleth',
        colorscale=scl,
        locations=df5['state'],
        z=df5['pc'],
        text=df5['State'],
        locationmode='USA-states',
        autocolorscale=True,
        colorbar=dict(title="% of Gun-` homocides")
    )]

    victim_race = pd.DataFrame(df, columns=['Victim_Race'])
    count_race = victim_race.stack().value_counts()
    df6 = count_race.to_frame().reset_index()
    df6 = df6.rename(columns={0: 'count'})
    df6.index.name = 'Victim_Race'
    df6.to_csv("static/" + "Victim_Race.csv", ",", index_label=True, index=False)

    victim_ethnicity = pd.DataFrame(df, columns=['Victim_Ethnicity'])
    count_ethnicity = victim_ethnicity.stack().value_counts()
    df6 = count_ethnicity.to_frame().reset_index()
    df6 = df6.rename(columns={0: 'count'})
    df6.index.name = 'Victim_Ethnicity'
    df6.to_csv("static/" + "Victim_Ethnicity.csv", ",", index_label=True, index=False)

    sex = pd.DataFrame(df, columns=['Victim_Sex'])
    count_sex = sex.stack().value_counts()
    df6 = count_sex.to_frame().reset_index()
    df6 = df6.rename(columns={0: 'count'})
    df6.index.name = 'Victim_Sex'
    df6.to_csv("static/" + "Victim_Sex.csv", ",", index_label=True, index=False)

    perpetrator_race = pd.DataFrame(df, columns=['Perpetrator_Race'])
    count_race = perpetrator_race.stack().value_counts()
    df6 = count_race.to_frame().reset_index()
    df6 = df6.rename(columns={0: 'count'})
    df6.index.name = 'Perpetrator_Race'
    df6.to_csv("static/" + "Perpetrator_Race.csv", ",", index_label=True, index=False)

    Perpetrator_ethnicity = pd.DataFrame(df, columns=['Perpetrator_Ethnicity'])
    count_ethnicity = Perpetrator_ethnicity.stack().value_counts()
    df6 = count_ethnicity.to_frame().reset_index()
    df6 = df6.rename(columns={0: 'count'})
    df6.index.name = 'Perpetrator_Ethnicity'
    df6.to_csv("static/" + "Perpetrator_Ethnicity.csv", ",", index_label=True, index=False)

    sex = pd.DataFrame(df, columns=['Perpetrator_Sex'])
    count_sex = sex.stack().value_counts()
    df6 = count_sex.to_frame().reset_index()
    df6 = df6.rename(columns={0: 'count'})
    df6.index.name = 'Perpetrator_Sex'
    df6.to_csv("static/" + "Perpetrator_Sex.csv", ",", index_label=True, index=False)

    solved = pd.DataFrame(df, columns=['Crime_Solved'])
    resolution = solved.stack().value_counts()
    df7 = resolution.to_frame().reset_index()
    df7 = df7.rename(columns={0: 'list'})
    df7.index.name = 'index'
    df7.to_csv("static/" + "CrimeSolved.csv", ",",index_label=True, index=False)

def sampling():
    # connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    # collection = connection[DBS_NAME][COLLECTION_NAME]
    # Murders = collection.find(projection=FIELDS)
    # data_db = pd.DataFrame(list(Murders))
    data_db = pd.read_csv("static/database.csv",low_memory="false")
    prepareData(data_db)
#    df = data_db.convert_objects(convert_numeric=True)
    df = data_db
    data_clean = df.dropna()
    raw_data = data_clean

    convertedData = data_clean

    clean_data = data_clean[['Agency_Code','Agency_Name', 'Agency_Type', 'City', 'State',
                          'Year','Month','Incident', 'Crime_Type','Crime_Solved','Victim_Sex','Victim_Age','Victim_Race','Victim_Ethnicity','Perpetrator_Sex','Perpetrator_Age',
                             'Perpetrator_Race','Perpetrator_Ethnicity','Relationship','Weapon']]
    random(clean_data)
    prepareDataForParallelCoordinates(clean_data)
    #kmeans_clustering(collection,clean_data)
    #connection.close()


def convertToNumeric(data_clean):
     le = preprocessing.LabelEncoder()
     le.fit(data_clean.Agency_Code)
     data_clean.loc[:, 'Agency_Code'] = le.transform(data_clean.Agency_Code)
     le1 = preprocessing.LabelEncoder()
     le1.fit(data_clean.Agency_Name)
     data_clean.loc[:, 'Agency_Name'] = le1.transform(data_clean.Agency_Name)
     le2 = preprocessing.LabelEncoder()
     le2.fit(data_clean.Agency_Type)
     data_clean.loc[:,'Agency_Type'] = le2.transform(data_clean.Agency_Type)
     le3 = preprocessing.LabelEncoder()
     le3.fit(data_clean.City)
     data_clean.loc[:, 'City'] = le3.transform(data_clean.City)
     le4 = preprocessing.LabelEncoder()
     le4.fit(data_clean.State)
     data_clean.loc[:, 'State'] = le4.transform(data_clean.State)
     le5 = preprocessing.LabelEncoder()
     le5.fit(data_clean.Crime_Type)
     data_clean.loc[:, 'Crime_Type'] = le5.transform(data_clean.Crime_Type)
     le6 = preprocessing.LabelEncoder()
     le6.fit(data_clean.Crime_Solved)
     data_clean.loc[:, 'Crime_Solved'] = le6.transform(data_clean.Crime_Solved)
     le7 = preprocessing.LabelEncoder()
     le7.fit(data_clean.Victim_Sex)
     data_clean.loc[:, 'Victim_Sex'] = le7.transform(data_clean.Victim_Sex)
     le8 = preprocessing.LabelEncoder()
     le8.fit(data_clean.Victim_Race)
     data_clean.loc[:, 'Victim_Race'] = le8.transform(data_clean.Victim_Race)
     le9 = preprocessing.LabelEncoder()
     le9.fit(data_clean.Victim_Ethnicity)
     data_clean.loc[:, 'Victim_Ethnicity'] = le9.transform(data_clean.Victim_Ethnicity)
     le10 = preprocessing.LabelEncoder()
     le10.fit(data_clean.Perpetrator_Sex)
     data_clean.loc[:, 'Perpetrator_Sex'] = le10.transform(data_clean.Perpetrator_Sex)
     le11 = preprocessing.LabelEncoder()
     le11.fit(data_clean.Perpetrator_Race)
     data_clean.loc[:, 'Perpetrator_Race'] = le11.transform(data_clean.Perpetrator_Race)
     le12 = preprocessing.LabelEncoder()
     le12.fit(data_clean.Perpetrator_Ethnicity)
     data_clean.loc[:, 'Perpetrator_Ethnicity'] = le12.transform(data_clean.Perpetrator_Ethnicity)
     le13 = preprocessing.LabelEncoder()
     le13.fit(data_clean.Relationship)
     data_clean.loc[:, 'Relationship'] = le13.transform(data_clean.Relationship)
     le14 = preprocessing.LabelEncoder()
     le14.fit(data_clean.Weapon)
     data_clean.loc[:, 'Weapon'] = le14.transform(data_clean.Weapon)
     le15 = preprocessing.LabelEncoder()
     le15.fit(data_clean.Month)
     data_clean.loc[:, 'Month'] = le15.transform(data_clean.Month)
     return data_clean


def random(data):
    data_standardized = standardize_data(data)
    rows = np.random.choice(data_standardized.index.values, 2000)
    random_sampled_data = data.ix[rows]
    print("random data:")
    print(random_sampled_data)
    decimated_df = random_sampled_data.convert_objects(convert_numeric=True)
    decimated_data_clean = decimated_df.dropna()
    data_clean = convertToNumeric(decimated_data_clean)
    new_data = data_clean[['Agency_Code','Agency_Name', 'Agency_Type', 'City', 'State',
                          'Year','Month','Incident', 'Crime_Type','Crime_Solved','Victim_Sex','Victim_Age','Victim_Race','Victim_Ethnicity','Perpetrator_Sex','Perpetrator_Age',
                             'Perpetrator_Race','Perpetrator_Ethnicity','Relationship','Weapon']]
    new_data_standardized = standardize_data(new_data)

    principal_component_analysis(new_data_standardized,random_sampled_data,'random_pca.csv')
    #MDS_euclidean(new_data_standardized,'random_mds_euclidean.csv')
    #MDS_correlation(new_data_standardized,'random_mds_correlation.csv')
    scree_Plot(new_data_standardized,'random_scree_plot.csv')


def standardize_data(cluster):
    clustervar = cluster.copy()
    # clustervar['num_critic_for_reviews'] = preprocessing.scale(clustervar['num_critic_for_reviews'].astype('float64'))
    # clustervar['duration'] = preprocessing.scale(clustervar['duration'].astype('float64'))
    # clustervar['num_voted_users'] = preprocessing.scale(clustervar['num_voted_users'].astype('float64'))
    # clustervar['cast_total_facebook_likes'] = preprocessing.scale(clustervar['cast_total_facebook_likes'].astype('float64'))
    # clustervar['num_user_for_reviews'] = preprocessing.scale(clustervar['num_user_for_reviews'].astype('float64'))
    # clustervar['budget'] = preprocessing.scale(clustervar['budget'].astype('float64'))
    # clustervar['actor_2_facebook_likes'] = preprocessing.scale(clustervar['actor_2_facebook_likes'].astype('float64'))
    # clustervar['actor_1_facebook_likes'] = preprocessing.scale(clustervar['actor_2_facebook_likes'].astype('float64'))
    # clustervar['imdb_score'] = preprocessing.scale(clustervar['imdb_score'].astype('float64'))
    # clustervar['movie_facebook_likes'] = preprocessing.scale(clustervar['movie_facebook_likes'].astype('float64'))
    return clustervar

def principal_component_analysis(new_data_standardized,new_data_original,filename):
    pca_2 = PCA(n_components=5)
    plot_columns = pca_2.fit_transform(new_data_standardized)
    print(pca_2.explained_variance_)
    print("--------------------------------------------------------------------------")
    print(pca_2.get_covariance())
    print("--------------------------------------------------------------------------")
    print(pca_2.components_)
    print("---------------------------------------------------------------------------")
    print(pca_2.explained_variance_ratio_)
    pve = pca_2.explained_variance_
    pve.shape
    pca_3 = PCA(n_components=2)
    pipeline = Pipeline([('scaling',StandardScaler()),('pca',pca_3)])
    pcaComponents =pipeline.fit_transform(new_data_standardized)

    matrix = np.array(pca_3.components_)
    Components = matrix.transpose()
    squareLoadings = []
    for x in range(len(Components)):
        y = 0
        for componentIndex in range(pca_3.n_components - 1):
            y = + (Components[x][componentIndex] * Components[x][componentIndex])
        squareLoadings.append(y)

    sortedIndices = np.argsort(squareLoadings);
    sortedSquareLoadings = np.sort(squareLoadings)[::-1]
    featureNames = []
    featuresSorted = []
    features = list(new_data_standardized.columns.values)
    y_pos = np.arange(len(features))
    for x in range(len(sortedIndices)):
        featuresSorted.append(features[sortedIndices[x]])

    screePlotData = [[0 for y in range(2)] for x in range(len(featuresSorted)-1)]
    for x in range(len(featuresSorted)-1):
        screePlotData[x][0] = featuresSorted[x]
        screePlotData[x][1] = sortedSquareLoadings[x]
    print(screePlotData)
    screePlotDataFrame = pd.DataFrame(screePlotData)
    screePlotDataFrame.columns =['Feature','SumSquareLoading']
    screePlotDataFrame.to_csv("static/pcaLoading_" + filename, ",", index_label=False, index=False)

    convertToNumeric(new_data_original)
    new_data_array = np.array(new_data_original)

    for x in range(3):
        featureNames.append(features[sortedIndices[x]])
    length = len(new_data_array)-1
    rows=[[0 for y in range(3)] for x in range(length)]
    for y in range(length):
        for x in range(3):
            rows[y][x]=new_data_array[y][sortedIndices[x]]

    print(rows)
    featureDataFrame = pd.DataFrame(rows)
    # featureDataFrame=convertToNumeric(featureDataFrame)
    featureDataFrame.columns = featureNames
   # for x in featureNames:
        #featureDataFrame[x] = preprocessing.scale(featureDataFrame[x].astype('float64'))
    featureDataFrame.to_csv("static/feature_" + filename, ",", index_label=False, index=False)
    pos = pd.DataFrame(pcaComponents)
    pos.columns = ['Component1', 'Component2']
    pos.to_csv("static/" + filename, ",", index_label=False, index=False)


def scree_Plot(new_data_standardized,filename):
    pca_2 = PCA(n_components=6)

    plot_columns = pca_2.fit_transform(new_data_standardized)
    print(pca_2.explained_variance_)
    print("--------------------------------------------------------------------------")
    print(pca_2.get_covariance())
    print("--------------------------------------------------------------------------")
    print(pca_2.components_)
    print("---------------------------------------------------------------------------")
    print(pca_2.explained_variance_ratio_)
    pve = pca_2.explained_variance_ratio_
    pve.shape
    X = pd.DataFrame(pve)
    X['x'] = range(1, len(pve) + 1)
    X.columns = ['y', 'x']
    X.to_csv("static/" + filename, ",", index_label=False, index=False)





sampling();
if __name__ == "__main__":
   app.run("127.0.0.1",3007)