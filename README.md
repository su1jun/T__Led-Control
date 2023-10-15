<h1>LED Control</h1>

<p>
    Welcome to my mini-project for the "Intelligent Control" course.<br>
    The objective of this project is to develop a web server using Raspberry Pi, which allows us to control an LED remotely.<br>
    Visit wwww.ledcontrol.site to access the control panel while the server is running.
</p>

<h2>Key Porint</h2>

<p>
    My aim was to create a panel that can be controlled remotely.<br>
    To achieve this, I utilized Websockets to enable <b>asynchronous communication</b>.
</p>

<h2>How Does It Work?</h2>

<ol>
    <li>Visit the site.</li>
    <li>Select one of the control panels for the device you want to control (e.g., Red LED, Blue LED, Green LED, or Fan) by clicking on one of the menu options.</li>
    <li>Control the LED or Fan by clicking on an image or button.</li>
    <li>Once clicked, the server receives your data, processes the command, sends back data, and allows you to see whether the device is turned on or off.</li>
</ol>

<h2>Build Details</h2>
<h3>Hardware</h3>
<ul>
    <li>Main: Raspberry Pi 4</li>
    <li>Components: Various LEDs, Fan Motor</li>
    <li>Circuit: Jumper Wires, Breadboard</li>
</ul>
<h3>Software</h3>
<ul>
    <li>Publishing: HTML + CSS (Bootstrap)</li>
    <li>Front-end: Vanilla JS</li>
    <li>Back-end: FastAPI</li>
    <li>Additional Logic: Python</li>
</ul>

<footer>
    <p>&copy; 2023 Jang Yu Sub</p>
</footer>
