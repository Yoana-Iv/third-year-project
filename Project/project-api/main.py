import numpy as np
import matplotlib.pyplot as plt
from flask import Flask
from flask import request
import json
import copy

# this function formats labels in order to avoid overlapping when multiple long labels appear in the dataset
def parse_labels(labels):
    for l in labels:
        labels[labels.index(l)] = labels[labels.index(l)].replace(" ", "\n")
        l = l.replace(" ", "\n")
        labels[labels.index(l)] = labels[labels.index(l)].replace("-", "-\n")
        l = l.replace("-", "-\n")
        if labels.index(l) % 2 == 1:
            labels[labels.index(l)] = "\n" + labels[labels.index(l)]

# splits dataset into labels and values for further processing
def parse_values(dataset):
    labels = []
    values = []
    for l in dataset:
        labels.append(l)
        values.append(dataset[l])
    return (labels, values)

# the four datasets used in the exercises are loaded and utilized to create the graphs
f1 = open('../src/data/dataset1.json')
f2 = open('../src/data/dataset2.json')
f3 = open('../src/data/dataset3.json')
f4 = open('../src/data/dataset4.json')
data1 = json.load(f1)
data2 = json.load(f2)
data3 = json.load(f3)
data4 = json.load(f4)
datasets = [data1, data2, data3, data4]
patterns = [ "|" , "\\" , "/" , "+" , "-", ".", "*","x", "o", "O", "///", "xx", ".O", "++", "-o", ".-", "|/" ]
red_shades = ["#FFC3BF", "#FF928A", "#FF7065", "#FF483A", "#D30F00"]
green_shades = ["#CDFFB5", "#A1FF74", "#73DE40", "#48C12A", "#1C8C00"]
blue_shades = ["#ABD3FF", "#729CCA", "#4187D5", "#2263AB", "#0034AD"]
random = ["#fe4e3e", "#8e1841", "#2d52c0", "#d55c61", "#9bd08e", "#4dc685", "#a14423", "#40693c", "#6911d1", "#0dc31e", "#c4068f", "#1b45e6", "#e64a0f", "#d72b41", "#a52e3f", "#4e0fd5", "#3602ea", "#0aae03", "#855e14", "#41ae1a", "#0765d1", "#a8aa5e", "#770717", "#053bec", "#d5f47b", "#f5eecb"]
pie_colours_one = ["#D55E00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#E69F00", "#BBCC33", "#77AADD", "#EE8866", "#EEDD88", "#FFAABB", "#44BB99", "#EE6677"]
pie_colours_two = ["#BBCC33", "#77AADD", "#EE8866", "#EEDD88", "#FFAABB", "#44BB99", "#EE6677", "#228833", "#BDAE40", "#66CCEE", "#AA3377", "#BBBBBB", "#D55E00"]
pie_colours_three = ["#EE6677", "#228833", "#BDAE40", "#66CCEE", "#AA3377", "#BBBBBB", "#D55E00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#E69F00", "#BBCC33"]

def get_colours_bar(values, colour):
    # colour all the bars with the same shade
    if colour == "blue only" or colour == "":
        return "royalblue"
    elif colour == "red only":
        return "firebrick"
    elif colour == "green only":
        return "limegreen"

    final_list = []
    # sample from pre-selected list of random colours
    if colour == "random":
        return random[0:len(values)]
    
    # if the colour scheme selected involves a gradient, use five pre-determined shades of the colour
    # and assign them to values depending on how close they are to the maximum value (pyplot will colour
    # each bar with a hue that has the same index in the colour list as the value of the bar in the values 
    # list, so the different shades are appended to a new list as appropriate)
    if colour == "red":
        list_colours = red_shades
    elif colour == "green":
        list_colours = green_shades
    elif colour == "blue":
        list_colours = blue_shades
    else:
        return "royalblue"
    for v in values:
        if v < max(values)/5:
            final_list.append(list_colours[0])
        elif v < (max(values)/5)*2:
            final_list.append(list_colours[1])
        elif v < (max(values)/5)*3:
            final_list.append(list_colours[2])
        elif v < (max(values)/5)*4:
            final_list.append(list_colours[3])
        else:
            final_list.append(list_colours[4])
    return final_list

# returns one of several pre-selected colour palettes for a pie chart
def get_colours_pie(colour):
    if colour == "one":
        return pie_colours_one
    elif colour == "two":
        return pie_colours_two
    elif colour == "three":
        return pie_colours_three
    else:
        return pie_colours_one

# returns a colour for a line graph
def get_colour_line(colour):
    if colour == "blue line":
        return "royalblue"
    elif colour == "red line":
        return "firebrick"
    elif colour == "green line":
        return "limegreen"
    else:
        return "royalblue"

# Returns a sorted dataset - either alphabetically, sorted by value in ascending order, or sorted
# by value in descending order. With no method of sorting specified, returns the original dataset.
def processSort(dataset, method):
    new_dict = {}
    if method == "keys":
        for val in sorted(dataset):
            new_dict[val] =  dataset[val]
    elif method == "up":
        for val in sorted(dataset.items(), key=lambda item: item[1]):
            new_dict[val[0]] = val[1]
    elif method == "down":
        for val in list(reversed(sorted(dataset.items(), key=lambda item: item[1]))):
            new_dict[val[0]] = val[1]
    else:
        return dataset
    return new_dict

# creates a flask application
def create_app(test_config = None):
    app = Flask(__name__)

    '''Creates a graph using the parameters received and saves it in a file.

    The parameters that every request must have are:
    - "type" - the type of the graph being created. Only line, bar or pie charts are accepted, any
    other value of this argument will throw a NameError.
    - "number" - which dataset should be used when creating a graph. Its value will be used to index into the datasets variable
    (see above) so it must be an int and in bounds.
    - "colour" - the desired colour or colours of the graph elements. Each possible graph type has its
    own way of encoding the colour (see functions above).Those are the values that will be recognized together with the line type. 
    Any other value will also be accepted, as long as the "colour" parameter is provided in the POST request, but the resulting graph
    will have the default colour. Providing a value in the wrong type (expected is String) will also lead to the default colour being used.
    - "order" - how the datapoints in the graph should be sorted (see processSort() above). Providing an unexpected value for this
    parameter will result in the default order being used.
    - "logarithmic" - whether or not logarithmic scaling should be used. If its value is "True", the graph will use a log scale. Any other
    value will mean the final product uses normal scaling.

    Additionally, if the type parameter is either "bar" or "pie" more arguments are required in the request. 
    For a bar graph:
    - "textures" - if the value is "True" textures will be added on the bars of the chart
    - "horizontal" - if the value is "True" the bar chart will be horizontal

    For a pie graph:
    - "legend" - whether or not a legend should be included in the final diagram
    - "percentage" - if the value is "True" each slice of the pie will have its percentage displayed
    '''
    @app.route('/make_graph', methods=['POST'])
    def graph_create():
        try:
            parsed_request = request.json
            dataset = datasets[parsed_request["number"]]
            sorted_dataset = processSort(dataset["values"], parsed_request["order"])
            labels, values = parse_values(sorted_dataset)

            # a copy of the labels pre-parsing is stored for use in legends and
            # horizontal bar graphs
            original_labels = copy.deepcopy(labels)
            parse_labels(labels)

            # the 'agg' back end is non-interactive and can only write to files - I use it since
            # this function only takes already chosen parameters and creates a graph from them, with all
            # user input happening at the front end
            plt.switch_backend('agg')
            fig = plt.figure(figsize=(20,10))

            # the background of the chart is set to be the same as the one used for the website to make the two cohesive
            fig.patch.set_facecolor('#e6f9ff')
            plt.rcParams.update({'font.size': 12})
            if parsed_request["type"] == "line":
                plt.plot(labels, values, color=get_colour_line(parsed_request["colour"]))
            elif parsed_request["type"] == "bar":
                if parsed_request["textures"] and parsed_request["horizontal"]:
                    plt.barh(list(reversed(original_labels)), list(reversed(values)), hatch = patterns[0:len(original_labels)], color = get_colours_bar(values, parsed_request["colour"]))
                elif parsed_request["horizontal"]:
                    plt.barh(list(reversed(original_labels)), list(reversed(values)), color = get_colours_bar(values, parsed_request["colour"]))
                elif parsed_request["textures"]:
                    plt.bar(labels,values, hatch = patterns[0:len(labels)], color = get_colours_bar(values, parsed_request["colour"]))
                else:
                    plt.bar(labels,values, color = get_colours_bar(values, parsed_request["colour"]))
            elif parsed_request["type"] == "pie":
                if parsed_request["percentage"]:
                    plt.pie(values, labels=labels, shadow=True, autopct='%.0f%%', startangle=90, colors=get_colours_pie(parsed_request["colour"]))
                else:
                    plt.pie(values, labels=labels, shadow=True, startangle=90, colors=get_colours_pie(parsed_request["colour"]))
                if parsed_request["legend"]:
                    plt.legend(bbox_to_anchor=(1, 1.025), loc='upper left', labels=original_labels)
            else:
                raise NameError("The graph type can only be line, bar or pie.")
            if parsed_request["logarithmic"] and parsed_request["type"] == "bar":
                if parsed_request["horizontal"]:
                    plt.xscale("log")
                else:
                    plt.yscale("log")
            elif parsed_request["logarithmic"]:
                plt.yscale("log")
            plt.savefig('../src/GeneratedGraph.png', bbox_inches='tight')
            plt.close()
            return {'done': "yes"}
        except Exception as e:
            return {'done' : 'no', 'exception': str(type(e).__name__), 'reasons' : e.args}
    return app


f1.close()
f2.close()
f3.close()
f4.close()