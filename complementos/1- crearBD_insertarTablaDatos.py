import sqlite3
import mysql.connector

#Obtención de datos de la base de datos SQLite
db = sqlite3.connect("gps_full.db")
cursor = db.cursor()
cursor.execute("SELECT * FROM data")
datos = cursor.fetchall()

#Conectar a MySQL
mySql = mysql.connector.connect(host="localhost",user="root",password="")

#Creación base de datos en MySQL, tabla e insercion de datos
cursor = mySql.cursor()
cursor.execute("CREATE DATABASE gps")

#Coneccion a bd creada
mySql = mysql.connector.connect(host="localhost",user="root",password="",db="gps")
cursor = mySql.cursor()

cursor.execute("CREATE TABLE datos(npk INTEGER PRIMARY KEY, id VARCHAR(20), lat REAL, lon REAL, velo INTEGER, angu INTEGER, fecha VARCHAR(10), hora VARCHAR(10), onoff INTEGER, nsat INTEGER);")

selec = """INSERT INTO datos(npk, id, lat, lon, velo, angu, fecha, hora, onoff, nsat)
          VALUE(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"""

cursor.executemany(selec,datos)
mySql.commit()
