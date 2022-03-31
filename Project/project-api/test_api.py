import pytest
from main import create_app



@pytest.fixture()
def app():
    app = create_app()
    app.config.update({
        "TESTING": True,
    })

    yield app


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def runner(app):
    return app.test_cli_runner()


def test_make_graph_endpoint_correct_request_line_graph(client):
    response = client.post("/make_graph", json={
        "type": "line", "textures": False, "colour": "", 
        "logarithmic": False, "order": "",
        "percentage": False, "number" : 0,
        "legend": False, "horizontal": False
        })
    assert response.status_code == 200
    assert response.json["done"] == "yes"


def test_make_graph_endpoint_correct_request_bar_graph(client):
    response = client.post("/make_graph", json={
        "type": "bar", "textures": False, "colour": "", 
        "logarithmic": False, "order": "",
        "percentage": False, "number" : 0,
        "legend": False, "horizontal": False
        })
    assert response.status_code == 200
    assert response.json["done"] == "yes"


def test_make_graph_endpoint_correct_request_pie_graph(client):
    response = client.post("/make_graph", json={
        "type": "pie", "textures": False, "colour": "", 
        "logarithmic": False, "order": "",
        "percentage": False, "number" : 0,
        "legend": False, "horizontal": False
        })
    assert response.status_code == 200
    assert response.json["done"] == "yes"


def test_make_graph_endpoint_request_successful_with_unexpected_colour_value_line(client):
    response = client.post("/make_graph", json={
        "type": "line", "textures": False, "colour": "new colour", 
        "logarithmic": False, "order": "",
        "percentage": False, "number" : 0,
        "legend": False, "horizontal": False
        })
    assert response.status_code == 200
    assert response.json["done"] == "yes"


def test_make_graph_endpoint_request_successful_with_unexpected_colour_value_bar(client):
    response = client.post("/make_graph", json={
        "type": "pie", "textures": False, "colour": "new colour", 
        "logarithmic": False, "order": "",
        "percentage": False, "number" : 0,
        "legend": False, "horizontal": False
        })
    assert response.status_code == 200
    assert response.json["done"] == "yes"


def test_make_graph_endpoint_request_successful_with_unexpected_colour_value_pie(client):
    response = client.post("/make_graph", json={
        "type": "pie", "textures": False, "colour": "new colour", 
        "logarithmic": False, "order": "",
        "percentage": False, "number" : 0,
        "legend": False, "horizontal": False
        })
    assert response.status_code == 200
    assert response.json["done"] == "yes"


def test_make_graph_endpoint_request_successful_with_unexpected_order_value_line(client):
    response = client.post("/make_graph", json={
        "type": "line", "textures": False, "colour": "", 
        "logarithmic": False, "order": "new order",
        "percentage": False, "number" : 0,
        "legend": False, "horizontal": False
        })
    assert response.status_code == 200
    assert response.json["done"] == "yes"


def test_make_graph_endpoint_request_successful_with_unexpected_order_value_bar(client):
    response = client.post("/make_graph", json={
        "type": "pie", "textures": False, "colour": "", 
        "logarithmic": False, "order": "new order",
        "percentage": False, "number" : 0,
        "legend": False, "horizontal": False
        })
    assert response.status_code == 200
    assert response.json["done"] == "yes"


def test_make_graph_endpoint_request_successful_with_unexpected_order_value_pie(client):
    response = client.post("/make_graph", json={
        "type": "pie", "textures": False, "colour": "", 
        "logarithmic": False, "order": "new order",
        "percentage": False, "number" : 0,
        "legend": False, "horizontal": False
        })
    assert response.status_code == 200
    assert response.json["done"] == "yes"


def test_make_graph_endpoint_request_successful_with_non_crucial_arguments_missing_line(client):
    response = client.post("/make_graph", json={
        "type": "line", "colour": "new colour", 
        "logarithmic": False, "order": "", "number" : 0
        })
    assert response.status_code == 200
    assert response.json["done"] == "yes"

def test_make_graph_endpoint_request_successful_with_some_arguments_in_wrong_type_line(client):
    response = client.post("/make_graph", json={
        "type": "line", "colour": 0, 
        "logarithmic": "False", "order": 1, "number" : 0
        })
    assert response.status_code == 200
    assert response.json["done"] == "yes"

def test_make_graph_endpoint_request_successful_with_non_crucial_arguments_missing_bar(client):
    response = client.post("/make_graph", json={
        "type": "bar", "textures": False, 
        "colour": "new colour", "logarithmic": False, 
        "order": "", "number" : 0, "horizontal": False
        })
    assert response.status_code == 200
    assert response.json["done"] == "yes"


def test_make_graph_endpoint_request_successful_with_some_arguments_in_wrong_type_bar(client):
    response = client.post("/make_graph", json={
        "type": "bar", "textures": "False", 
        "colour": 0, "logarithmic": "False", 
        "order": 1, "number" : 0, "horizontal": "False"
        })
    assert response.status_code == 200
    assert response.json["done"] == "yes"


def test_make_graph_endpoint_request_successful_with_non_crucial_arguments_missing_pie(client):
    response = client.post("/make_graph", json={
        "type": "pie",  "colour": "new colour", 
        "logarithmic": False, "order": "", "number" : 0,
        "percentage": False, "legend": False
        })
    assert response.status_code == 200
    assert response.json["done"] == "yes"


def test_make_graph_endpoint_request_successful_with_some_arguments_in_wrong_type_pie(client):
    response = client.post("/make_graph", json={
        "type": "pie",  "colour": 0, 
        "logarithmic": "False", "order": 1, "number" : 0,
        "percentage": "False", "legend": "False"
        })
    assert response.status_code == 200
    assert response.json["done"] == "yes"


def test_make_graph_endpoint_incorrect_request_crucial_argument_type_missing(client):
    response = client.post("/make_graph", json={
        "textures": False, "colour": "", 
        "logarithmic": False, "order": "",
        "percentage": False, "number" : 0,
        "legend": False, "horizontal": False
        })
    assert response.status_code == 200
    assert response.json["done"] == "no"
    assert response.json["exception"] == "KeyError"
    assert response.json["reasons"] == ['type']


def test_make_graph_endpoint_incorrect_request_crucial_argument_logarithmic_missing(client):
    response = client.post("/make_graph", json={
        "type": "line", "textures": False, "colour": "", 
        "order": "", "percentage": False, "number" : 0,
        "legend": False, "horizontal": False
        })
    assert response.status_code == 200
    assert response.json["done"] == "no"
    assert response.json["exception"] == "KeyError"
    assert response.json["reasons"] == ['logarithmic']


def test_make_graph_endpoint_incorrect_request_crucial_argument_colour_missing(client):
    response = client.post("/make_graph", json={
        "type": "line", "textures": False,
        "logarithmic": False, "order": "",
        "percentage": False, "number" : 0,
        "legend": False, "horizontal": False
        })
    assert response.status_code == 200
    assert response.json["done"] == "no"
    assert response.json["exception"] == "KeyError"
    assert response.json["reasons"] == ['colour']


def test_make_graph_endpoint_incorrect_request_crucial_argument_order_missing(client):
    response = client.post("/make_graph", json={
        "type": "line", "textures": False, "colour": "", 
        "logarithmic": False, "percentage": False, "number" : 0,
        "legend": False, "horizontal": False
        })
    assert response.status_code == 200
    assert response.json["done"] == "no"
    assert response.json["exception"] == "KeyError"
    assert response.json["reasons"] == ['order']


def test_make_graph_endpoint_incorrect_request_crucial_argument_number_missing(client):
    response = client.post("/make_graph", json={
        "type": "line", "textures": False,
        "logarithmic": False, "order": "",
        "percentage": False, "legend": False, "horizontal": False
        })
    assert response.status_code == 200
    assert response.json["done"] == "no"
    assert response.json["exception"] == "KeyError"
    assert response.json["reasons"] == ['number']


def test_make_graph_endpoint_incorrect_request_crucial_argument_textures_missing_bar(client):
    response = client.post("/make_graph", json={
        "type" : "bar", "colour": "", 
        "logarithmic": False, "order": "",
        "percentage": False, "number" : 0,
        "legend": False, "horizontal": False
        })
    assert response.status_code == 200
    assert response.json["done"] == "no"
    assert response.json["exception"] == "KeyError"
    assert response.json["reasons"] == ['textures']


def test_make_graph_endpoint_incorrect_request_crucial_argument_horizontal_missing_bar(client):
    response = client.post("/make_graph", json={
        "type": "bar", "textures": False, "colour": "", 
        "logarithmic": False, "order": "",
        "percentage": False, "number" : 0,
        "legend": False
        })
    assert response.status_code == 200
    assert response.json["done"] == "no"
    assert response.json["exception"] == "KeyError"
    assert response.json["reasons"] == ['horizontal']


def test_make_graph_endpoint_incorrect_request_crucial_argument_percentage_missing_pie(client):
    response = client.post("/make_graph", json={
        "type": "pie", "textures": False, "colour": "", 
        "logarithmic": False, "order": "", "number" : 0,
        "legend": False, "horizontal": False
        })
    assert response.status_code == 200
    assert response.json["done"] == "no"
    assert response.json["exception"] == "KeyError"
    assert response.json["reasons"] == ['percentage']

def test_make_graph_endpoint_incorrect_request_crucial_argument_legend_missing_pie(client):
    response = client.post("/make_graph", json={
        "type": "pie", "textures": False, "colour": "", 
        "logarithmic": False, "order": "",
        "percentage": False, "number" : 0,"horizontal": False
        })
    assert response.status_code == 200
    assert response.json["done"] == "no"
    assert response.json["exception"] == "KeyError"
    assert response.json["reasons"] == ['legend']


def test_make_graph_endpoint_incorrect_request_number_argument_wrong_type(client):
    response = client.post("/make_graph", json={
        "type": "line", "textures": False, "colour": "", 
        "logarithmic": False, "order": "",
        "percentage": False, "number" : "0",
        "legend": False, "horizontal": False
        })
    assert response.status_code == 200
    assert response.json["done"] == "no"
    assert response.json["exception"] == "TypeError"
    assert response.json["reasons"] == ['list indices must be integers or slices, not str']


def test_make_graph_endpoint_incorrect_request_problem_wrong_graph_type(client):
    response = client.post("/make_graph", json={
        "type": "scatter", "textures": False, "colour": "", 
        "logarithmic": False, "order": "",
        "percentage": False, "number" : 0,
        "legend": False, "horizontal": False
        })
    assert response.status_code == 200
    assert response.json["done"] == "no"
    assert response.json["exception"] == "NameError"
    assert response.json["reasons"] == ['The graph type can only be line, bar or pie.']


def test_make_graph_endpoint_incorrect_request_number_out_of_bounds(client):
    response = client.post("/make_graph", json={
        "type": "line", "textures": False, "colour": "", 
        "logarithmic": False, "order": "",
        "percentage": False, "number" : 5,
        "legend": False, "horizontal": False
        })
    assert response.status_code == 200
    assert response.json["done"] == "no"
    assert response.json["exception"] == "IndexError"
    assert response.json["reasons"] == ['list index out of range']


