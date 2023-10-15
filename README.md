<h1>LED Control</h1>

<p>
    Welcome to my mini-project for the "Intelligent Control" course.<br>
    The objective of this project is to develop a web server using Raspberry Pi, which allows us to control an LED remotely.<br>
    Visit www.ledcontrol.site to access the control panel while the server is running.
</p>

<h2>Key Porint</h2>

<p>
    My aim was to create a panel that can be controlled remotely.<br>
    To achieve this, I utilized Websockets to enable <b>asynchronous communication</b>.
</p>

<h2>How Does It Work?</h2>

<ol>
    <li>Visit the site.</li>
    <li>Select one of the <b>control panels for</b>b> the device you want to control (e.g., Red LED, Blue LED, Green LED, or Fan) by clicking on one of the menu options.</li>
    <li>Control the <b>LED</b>b> or <b>Fan</b>b> by clicking on an image or button.</li>
    <li>Once clicked, the server receives your data, processes the command, sends back data, and allows you to see whether the <b>device is turned on or off.</b>b></li>
</ol>

<h2>Build Details</h2>
<h3>Hardware</h3>
<ul>
    <li><b>Main</b> : Raspberry Pi 4</li>
    <li><b>Components</b> : Various LEDs, Fan Motor</li>
    <li><b>Circuit</b> : Jumper Wires, Breadboard</li>
</ul>
<h3>Software</h3>
<ul>
    <li><b>Publishing</b> : HTML + CSS (Bootstrap)</li>
    <li><b>Front-end</b> : Vanilla JS</li>
    <li><b>Back-end</b> : FastAPI</li>
    <li><b>Additional Logic</b> : Python</li>
</ul>

<footer>
    <p>&copy; 2023 Jang Yu Sub</p>
</footer>
