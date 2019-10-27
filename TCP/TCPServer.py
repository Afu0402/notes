#coding=utf-8

from socket import *

serverName = '192.168.0.175'
serverPost = 8080

# 创建套接字。AF_INET表明使用ipv4网络，SOCK_TREAM表示使用tcp作为传输协议
serverSocket = socket(AF_INET,SOCK_STREAM)

# 将服务器ip和端口号绑定到套接字
serverSocket.bind((serverName,serverPost))

# 监听请求 最大请求数为1
serverSocket.listen(1)

print('The server is ready to receive')

while True:
  # 监听到用户请求后调用serverSocket.accept()会新开一个套接字，客户和服务器直接通过这个新的套接字进行交流。
  # 此时客户和服务器也完成了三次握手的过程。
  connectionSocket,addr = serverSocket.accept()
  print('收到客户端连接，并已完成三次握手,客户端ip地址和端口如下:')
  print(addr)
  print('-----------------------------------------------')

  message = connectionSocket.recv(1024)

  # 把消息转化为大写
  messageUpper = message.decode('utf-8').upper()
  connectionSocket.send(messageUpper.encode('utf-8'))

  connectionSocket.close()