import React, { Component } from 'react';
import {Link, Route, withRouter, Switch} from 'react-router-dom';


class App extends Component {
  constructor() {
    super()
    this.state = {
      searchTerm: "",
      photos: [],
      selectedPhoto: "",
      pageList: null,
      pages: null,
      overlayDisplay: 'none'
    }
    this.handleChange = this.handleChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.renderPages = this.renderPages.bind(this)
    this.showOverlay = this.showOverlay.bind(this)
  }

  componentWillMount() {
    if(this.state.pages === null) {
      this.props.history.push('/')
    }
  }
  
  handleChange(event) {
    this.setState({
      searchTerm: event.target.value
    })
  }

  render() {
    return (
      <div className="App">
        <div className="Nav">
          <h2>Forbes Image Challenge Search</h2>
          <form>
                <input onChange={this.handleChange} value={this.searchTerm} type="text" placeholder="Enter Search Term" />
                <input onClick={this.onSubmit} type="submit" value="Search Flickr"></input>
            </form>
        </div>
        <div className="Main">
            <div className="Page-list">{this.state.pageList}</div>
            <Switch>
              <Route path="/:id" render={(props) => {
                  
                  return  <div>
                    {this.state.pages[props.match.params.id-1]}
                  </div>}} />
            </Switch>
            <div className="Page-list">{this.state.pageList}</div>
            <div style={{display: this.state.overlayDisplay}} className="Overlay" >
              <button className="Close-button" onClick={() => {this.setState({overlayDisplay: 'none'})}}>X</button>
              <img className="Image" src={this.state.selectedPhoto} alt="overlay"/>
            </div>
        </div>
      </div>
    );
  }

  onSubmit(event) {
    event.preventDefault()
    this.searchFlickr()
  }

  searchFlickr() {
    console.log(this.state.searchTerm)
    var url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&text="${this.state.searchTerm.split(' ').join('","')}"&tag_mode=all&api_key=bcc3f2857555db0a66b3c1f6dc783fde&format=json&nojsoncallback=1`
    fetch(url)
      .then(res => res.json())
      .then(data => this.renderPageList(data.photos.photo))
      // this.renderPageList(["hey","cat","cat","cat","cat","cat","cat","cat","cat","cat","cat","cat","cat","cat","cat"])
  }

  renderPageList(photos) {
    var pages = this.renderPages(photos)
    var pageList =  pages.map((page, index) => {
                      return <Link className="Page-list" to={`${index+1}`} key={index}>{index+1}</Link>
                    })
    this.setState({
      pageList: pageList,
      pages: pages,
      searchTerm: ""
    })
    this.props.history.push('/1')
  }
  renderPages(photos) {
    console.log(photos)
    var pageCount = Math.ceil(photos.length/10)
    var pages = []
    var photoList = photos.map((photo,index) => {
        var photoUrl = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`
        return ( <div className="Photo-container" key={index} value={photo} onClick={this.showOverlay}>
                  <img className="Image" src={photoUrl} alt="flickr test"/>
                  <h5>{photo.title}</h5>
                </div>
        )
    })
    for(let n = 0; n < pageCount; n++) {
      pages.push(photoList.slice((n*10),(n*10)+10))
    }
   return pages
  }

  showOverlay(e) {
    this.setState({
      overlayDisplay: 'block',
      selectedPhoto: e.target.src
    })
  }

}

export default withRouter(App);