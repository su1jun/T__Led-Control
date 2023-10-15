<h1>LED Control</h1>

<p>
    This is miniproject for my course, Inteligence Control
    Goal of this projetc is to make web server with raspberrypi and control led connected from it
    You can access to <a href="www.ledcontrol.site>www.ledcontrol.site</a> during server work
</p>

<h2>Key Porint</h2>

<p>
    I wanted to make panel that can be controlled by someone
    For this goal, I used Websocket to support <b>asynchronous communication</b>
</p>

<h2>How work?</h2>

<p>
    1. Get in this site
    2. Move to one of the control panels you want control such as Red LED, Blue LED, Green LED and Fan by clicking one of the menue
    3. then you can control LED or Fan by clicking one of the images or button
    4. As you click these one, server receive your data and process the work
       and then server send you the data and you can see what is turn on or off
</p>

<h3>How make?</h3>

<p>
    Hardware :
        main : Raspberry pi 4
        part : Some of LED, Fan motor
        circuit : Jumper line, bread borad
    Software : 
        publishing : HTML + CSS(Boot Strap)
        front-end : vanilla JS
        Back-end : fastAPI
        other logic : python
</p>

<footer>
    &copy; 2023 Jang Yu Sub
</footer>
