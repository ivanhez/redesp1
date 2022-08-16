Proyecto 1 - Redes
Marlon Hernández

Cliente de XMPP

Para utilizar el cliente es necesario tener instalado Node.js, las librerías necesarias para correr el programa se incluyen, no es necesario instalar nada adicional.

Luego de clonar el repositorio, para correr el cliente se utiliza el comando dentro de la carpeta del repositorio.

> node index.js

Se desplegará un menu con las siguientes opciones

>.--------------.
>| MENU         |
>+--------------+
>| [1] LOGIN    |
>|  2) REGISTER |
>|  3) EXIT     |
>'--------------'
>Type a hotkey or use Down/Up arrows then Enter to choose an item.

Dentro de la terminal pueden utilizarse las flechas de selección del teclado y enter para ingresar a la opción, o tambien presionar la tecla numerada de la opción que se quiera ingresar.

Las opciones y su funcionalidad son las siguientes:

[1] LOGIN: Se pide al usuario su usuario y contraseña para ingresar al servidor de alumchat.fun, debido a que este cliente es solamente para utilizar con alumchat.fun, no se debe escribir el dominio @alumchat.fun y solamente el nombre de usuario, seguido de la contraseña.

[2] REGISTER: Se pide al usuario un nuevo nombre de usuario y contraseña para registrarse con el dominio alumchat.fun, de igual manera no se debe escribir el nombre del dominio.

Si el usuario se autentica correctamente, el cliente establecerá la conexión con el dominio y se desplegará un nuevo menú de la siguiente manera:

>WELCOME test
>.-----------------------.
>| NODECHAT              |
>+-----------------------+
>| [1] CHAT              |       
>|  2) ROSTER            |       
>|  3) DISCONNECT        |       test is online
>|  4) EDIT PRESENCE     |       echobot is online      
>|  5) SEND NOTIFICATION |       
>|  6) ADD CONTACT       |      
>|  7) CHECK CONTACT     |
>|  8) SEND FILE         |
>|  9) GROUPCHAT         |
>|                       |
>|  0) DELETE USER       |
>'-----------------------'

En este menu las funcionalidades son las siguientes:

[1] CHAT: Se puede enviar un mensaje a cualquier usuario registrado en el dominio alumchat.fun, se pide al usuario que escriba el usuario destino y el mensaje a enviar.

[2] ROSTER: Se muestra los contactos del usuario y su estado.

[3] DISCONNECT: Se desconecta del dominio y vuelve al menu de inicio.

[4] EDIT PRESENCE: Se pide al usuario ingresar un nuevo mensaje de STATUS para ser enviado en el envío de PRESENCE.

[5] SEND NOTIFICATION: Se pide al usuario enviar un mensaje para el dominio pubsub.alumchat.fun.

[6] ADD CONTACT: Se pide al usuario que ingrese el username de contacto para poder agregarlo en el roster. El usuario luego manda solicitud de PRESENCE como SUBSCRIBE y si este manda SUBSCRIBED se podrá recibir mensajes de PRESENCE.

[7] CHECK CONTACT: El usuario ingresa el user que se desea consultar, y se muestra su PRESENCE y STATUS si existe.

[8] SEND FILE: Sin implementar.

[9] GROUPCHAT: Sin implementar.

[0] DELETE USER: Se elimina el usuario del dominio alumchat.fun y vuelve al menu principal.