#coding=utf-8
from socket import *

serverName = '192.168.0.175'
serverPost = 8080

def create_tcp_connect():
    # 客户端创建一个套接字。AF_INET表明使用ipv4网络，SOCK_TREAM表示使用tcp作为传输协议
    clientSocket = socket(AF_INET,SOCK_STREAM)

    # 客户端发送一个TCP连接。并传入服务端的ip地址和端口号，进行三次握手；
    clientSocket.connect((serverName,serverPost))

    # 接受来自命令行的输入
    message = input('input:')
    print('发送数据：'+ message)

    # 客户端把数据传入和服务端建立连接后的套接字！由套接字负责传送和接受数据；
    clientSocket.send(message.encode('utf-8'))

    # 接收来自服务端的相应
    responseMessage = clientSocket.recv(1024)

    print('接收服务端相应的数据：'+ responseMessage)
    clientSocket.close()

while True:
  create_tcp_connect()


