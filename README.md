# Delhi Metro Navigator — Java Edition 🚇☕

An AI-powered smart metro navigation system written in **Java 21**. Includes Dijkstra shortest-path route planning, AI multi-factor exit gate recommendations, emergency safety helpline directory, and built-in HTTP server.

---

## 🚀 Features

- ⚡ **Java Dijkstra Pathfinding**: Calculates Fastest Route & Minimum Interchange routes in pure Java.
- 🚪 **Java AI Exit Gate Evaluator**: Multi-factor scoring model in Java for optimal station exit selection and natural language explanations.
- 💳 **Smart Card Recharge**: Built-in redirection handler to `https://www.dmrcsmartcard.com/`.
- 🚨 **Safety Helplines Directory**: Built-in emergency response numbers for Police (112, 1511), Women's Safety (1091, 181), and Divyangjan Escort (155370).
- 🌐 **Embedded Java Web Server**: High-performance `com.sun.net.httpserver` web server running on port `8080`.

---

## 🛠️ How to Compile & Run

### Prerequisites
- **Java JDK 17 or Java JDK 21+**

### Compile Java Source Code

```powershell
javac -d bin src/com/delhimetro/model/*.java src/com/delhimetro/service/*.java src/com/delhimetro/server/*.java src/com/delhimetro/*.java
```

### Launch Java Server

```powershell
java -cp bin com.delhimetro.Main
```

Then open **`http://localhost:8080`** in your browser!
