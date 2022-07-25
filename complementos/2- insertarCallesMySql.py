import mysql.connector as conecta

leerTxt = open("./calles_temuco.txt","r", encoding="utf8")
calles = []

for i in leerTxt.read().split("\n"):
    calles.append(tuple([i]))
    
leerTxt.close()

conexion = conecta.connect(host="localhost", user="root",password="",db="gps")
cursor = conexion.cursor()
cursor.execute("CREATE TABLE calles(id INTEGER PRIMARY KEY AUTO_INCREMENT,nombre VARCHAR(40))")

select="INSERT INTO calles(nombre) VALUE(%s)"
cursor.executemany(select,calles)
conexion.commit()
