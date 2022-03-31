import main
import pytest


def test_labels_parsing():
    input_labels = ["Test Label 1", "TestLabel2", "Test-Label-3"]
    output_labels = ["Test\nLabel\n1", "\nTestLabel2", "Test-\nLabel-\n3"]
    main.parse_labels(input_labels)
    assert input_labels == output_labels

def test_dataset_parsing():
    input_dataset = {"Test Label 1" : 100, "Test Label 2" : 3000, "Test Label 3": 1}
    parsed_dataset = (["Test Label 1", "Test Label 2", "Test Label 3"], [100, 3000, 1])
    assert main.parse_values(input_dataset) == parsed_dataset

def test_gradient_colouring_bar_chart():
    input_values = [100, 300, 1, 160, 67, 390, 450, 16, 260]
    selected_colours = ["#FF928A", "#FF483A", "#FFC3BF", "#FF928A", "#FFC3BF", "#D30F00", "#D30F00", "#FFC3BF", "#FF7065"]
    assert main.get_colours_bar(input_values, "red") == selected_colours

def test_set_colouring_bar_chart():
    input_values = [100, 300, 1, 160, 67, 390, 450, 16, 260]
    selected_colour = "firebrick"
    assert main.get_colours_bar(input_values, "red only") == selected_colour

def test_default_colouring_bar_chart():
    input_values = [100, 300, 1, 160, 67, 390, 450, 16, 260]
    selected_colour = "royalblue"
    assert main.get_colours_bar(input_values, "") == selected_colour

def test_pie_chart_colouring_first_palette():
    selected_colours = ["#D55E00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#E69F00", "#BBCC33", "#77AADD", "#EE8866", "#EEDD88", "#FFAABB", "#44BB99", "#EE6677"]
    assert main.get_colours_pie("one") == selected_colours

def test_pie_chart_colouring_second_palette():
    selected_colours = ["#BBCC33", "#77AADD", "#EE8866", "#EEDD88", "#FFAABB", "#44BB99", "#EE6677", "#228833", "#BDAE40", "#66CCEE", "#AA3377", "#BBBBBB", "#D55E00"]
    assert main.get_colours_pie("two") == selected_colours

def test_pie_chart_colouring_third_palette():
    selected_colours = ["#EE6677", "#228833", "#BDAE40", "#66CCEE", "#AA3377", "#BBBBBB", "#D55E00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#E69F00", "#BBCC33"]
    assert main.get_colours_pie("three") == selected_colours

def test_pie_chart_colouring_default_palette():
    selected_colours = ["#D55E00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#E69F00", "#BBCC33", "#77AADD", "#EE8866", "#EEDD88", "#FFAABB", "#44BB99", "#EE6677"]
    assert main.get_colours_pie("") == selected_colours

def test_line_chart_colour_chosen():
    assert main.get_colour_line("red line") == "firebrick"

def test_line_chart_colour_default():
    assert main.get_colour_line("") == "royalblue"

def test_sorting_alphabetical():
    input_dataset = {
        "Test Label C" : 100, "Test Label Y" : 300, "Test Label A" : 1,
        "Test Label I" : 160, "Test Label K" : 67, "Test Label B" : 390
        }
    output_dataset = {
        "Test Label A": 1, "Test Label B": 390, "Test Label C": 100, 
        "Test Label I": 160, "Test Label K": 67, "Test Label Y": 300
        }
    assert main.processSort(input_dataset, "keys") == output_dataset

def test_sorting_ascending():
    input_dataset = {
        "Test Label C" : 100, "Test Label Y" : 300, "Test Label A" : 1,
        "Test Label I" : 160, "Test Label K" : 67, "Test Label B" : 390
        }
    output_dataset = {
        "Test Label A": 1, "Test Label K": 67, "Test Label C": 100, 
        "Test Label I": 160, "Test Label Y": 300, "Test Label B": 390
        }
    assert main.processSort(input_dataset, "up") == output_dataset

def test_sorting_descending():
    input_dataset = {
        "Test Label C" : 100, "Test Label Y" : 300, "Test Label A" : 1,
        "Test Label I" : 160, "Test Label K" : 67, "Test Label B" : 390
        }
    output_dataset = {
        "Test Label B": 390, "Test Label Y": 300, "Test Label I": 160,
        "Test Label C": 100, "Test Label K": 67, "Test Label A": 1
        }
    assert main.processSort(input_dataset, "down") == output_dataset

def test_sorting_default():
    input_dataset = {
        "Test Label C" : 100, "Test Label Y" : 300, "Test Label A" : 1,
        "Test Label I" : 160, "Test Label K" : 67, "Test Label B" : 390
        }
    assert main.processSort(input_dataset, "") == input_dataset
