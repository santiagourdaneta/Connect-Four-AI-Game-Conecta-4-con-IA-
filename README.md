
Un clásico juego de Conecta 4 implementado en JavaScript, HTML y CSS, ¡con un oponente de Inteligencia Artificial desafiante! Pon a prueba tus habilidades estratégicas.

Demo: https://glowing-space-doodle-r4g9746v75p2ww94-8080.app.github.dev/

# 🟡🔴 Connect Four AI Game | Conecta 4 con Inteligencia Artificial

---

¡Bienvenido al **Connect Four AI Game**! Este es un clásico juego de Conecta 4 reimaginado para el navegador, donde puedes desafiar a una Inteligencia Artificial estratégica. Desarrollado con JavaScript puro, HTML5 y CSS3, este proyecto ofrece una experiencia de juego fluida y visualmente atractiva, con animaciones de caída de fichas y una IA que te hará pensar.

## 🚀 Características Destacadas

* **Juega contra la IA:** Un oponente de Inteligencia Artificial que busca ganar, bloquearte y crear sus propias amenazas.
* **Animaciones Fluidas:** Disfruta de animaciones suaves de las fichas al caer en el tablero.
* **Interfaz Intuitiva:** Diseño limpio y fácil de usar.
* **Detección de Victoria/Empate:** Lógica robusta para identificar líneas de cuatro (horizontal, vertical, diagonal) y condiciones de empate.
* **Código Limpio y Comentado:** Fácil de entender y extender.

## 🛠️ Tecnologías Utilizadas

* **HTML5:** Estructura del juego.
* **CSS3:** Estilos visuales y animaciones.
* **JavaScript (ES6+):** Lógica del juego y comportamiento de la IA.

## 🕹️ Cómo Jugar

1.  **Clona el repositorio** o descarga los archivos `HTML`, `CSS` y `JavaScript`.
2.  Abre el archivo `index.html` en tu navegador web preferido.
3.  El jugador **Rojo** (humano) siempre comienza.
4.  Haz clic en cualquier columna para dejar caer tu ficha.
5.  Tu objetivo es conseguir cuatro de tus fichas en línea (horizontal, vertical o diagonal) antes que el oponente **Amarillo** (IA).
6.  Si el tablero se llena y nadie ha conectado cuatro, el juego termina en empate.
7.  Usa el botón "Jugar de Nuevo" para reiniciar la partida en cualquier momento.

## 🧠 Lógica de la IA

La Inteligencia Artificial de este Conecta 4 sigue una estrategia por prioridades para tomar sus decisiones:

1.  **Movimiento Ganador:** Si la IA puede ganar en el turno actual, lo hará.
2.  **Bloqueo de Victoria:** Si el jugador humano puede ganar en su siguiente turno, la IA lo bloqueará.
3.  **Creación de Amenazas:** Busca oportunidades para crear una línea de 3 fichas para sí misma, forzando una victoria futura.
4.  **Bloqueo de Amenazas:** Identifica y bloquea las líneas de 3 fichas del jugador humano.
5.  **Movimiento Central:** Prioriza las columnas centrales del tablero por su valor estratégico.
6.  **Movimiento Aleatorio:** Si no se encuentra ninguna de las anteriores, la IA elige una columna válida al azar.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar la IA, optimizar el código o añadir nuevas características, no dudes en abrir un *issue* o enviar un *pull request*.

---
