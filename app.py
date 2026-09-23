from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def dashboard():
    return render_template("dashboard.html")


@app.route("/products")
def products():
    return render_template("products.html")


@app.route("/billing")
def billing():
    return render_template("billing.html")


@app.route("/sales")
def sales():
    return render_template("sales.html")


@app.route("/invoice")
def invoice():
    return render_template("invoice.html")


@app.route("/analytics")
def analytics():
    return render_template("analytics.html")


@app.route("/settings")
def settings():
    return render_template("settings.html")


if __name__ == "__main__":
    app.run(debug=True)