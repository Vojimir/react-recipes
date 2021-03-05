import axios from "axios";
import { Component } from "react";
import "./Recipes.css";

class Recepies extends Component {
  state = {
    recipes: null,
    currentPage: null,
    totalPages: null,
    search: null,
  };
  fetchRecipes = (currentPage = 1) => {
    axios
      .get(
        `http://localhost:8081/recipes?${this.state.search}&page=${currentPage}`
      )
      .then((response) => {
        let updateRecepiesData = { ...response.data };
        this.setState({
          recipes: { ...updateRecepiesData.recipes },
          currentPage: Object.values(updateRecepiesData)[0],
          totalPages: Object.values(updateRecepiesData)[1],
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  componentDidMount() {
    this.fetchRecipes();
  }
  whichPage = (event) => {
    let pageNumber = parseInt(event.target.outerText);
    if (pageNumber !== this.state.currentPage) {
      this.setState({ currentPage: pageNumber });
      this.fetchRecipes(pageNumber);
    }
  };
  totalPagesCount = (totalPages = 1) => {
    let arrayOfPageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      arrayOfPageNumbers.push(i);
    }
    return arrayOfPageNumbers;
  };
  deleteHandler = (id) => {
    axios
      .delete(`http://localhost:8081/recipes/${id}`)
      .then(this.fetchRecipes(this.state.currentPage));
  };
  searchFilterHandler = (event) => {
    let dud = event.target.value;
    let keyword = "search=".concat("", dud);
    this.setState({ search: keyword }, () => {
      if (this.state.search && this.state.search.length > 1) {
        this.fetchRecipes();
      }
    });
  };

  render() {
    let recipesCopy = { ...this.state.recipes };
    let listObject = Object.keys(recipesCopy).map((key) => {
      return (
        <div key={key} className="recipeContainer">
          <button
            onClick={() =>
              this.deleteHandler(parseInt(Object.values(recipesCopy[key])[3]))
            }
            className="deleteButton"
          >
            Delete
          </button>
          <h2>{Object.values(recipesCopy[key])[0]}</h2>
          <p>{Object.values(recipesCopy[key])[1]}</p>
        </div>
      );
    });
    let test = this.totalPagesCount(this.state.totalPages).map((el) => {
      {
        return (
          <div onClick={this.whichPage} key={el} className="pagination">
            {el}
          </div>
        );
      }
    });
    return (
      <div>
        <div className="container">
          <div className="innerContainer">
            <h1>Recipes overview</h1>
            <input
              onChange={(event) => this.searchFilterHandler(event)}
              className="filter"
              placeholder="Filter"
            ></input>
            {listObject}
            {test}
          </div>
        </div>
      </div>
    );
  }
}

export default Recepies;
