import Axios from 'axios';
import React, { Component } from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import './CryptoTableView.css'
import 'bootstrap/dist/css/bootstrap.min.css'



export class CryptoTableView extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             coins:[],
             selectedPage:1,
             pageSize:10
        }
        //to avoid complications of undefined "this"
        this.handlePageChange=this.handlePageChange.bind(this);
        this.handlePageSizeChange=this.handlePageSizeChange.bind(this);
        Axios.get("https://ciswebapi2.cryptoindexseries.com/api/Search/CoinSearch?page_size=10&page_number=1&ccy=USD")
        .then(res=>{
            this.totalCount=res.data.total_count;
        })
    
    }

    componentDidMount(){
        Axios.get("https://ciswebapi2.cryptoindexseries.com/api/Search/CoinSearch?page_size=10&page_number=1&ccy=USD")
        .then(res=>{
            this.setState({coins:res.data.data})
        })
    }

    handlePageChange(coins,pageClicked){
        this.setState({coins:coins,selectedPage:pageClicked})
    }

    handlePageSizeChange(coins,pageSize){
        this.setState({coins:coins,pageSize:pageSize})
    }

    render() {

        return (
            <div className="coinsTable">
                <PageSizeInput onPageSizeChange={this.handlePageSizeChange} selectedPage={this.state.selectedPage}  />
                <TableHeader/>
                <CoinRows coins={this.state.coins} />
                <PaginationInput onPageChange={this.handlePageChange} totalCount={this.totalCount} pageSize={this.state.pageSize} />
            </div>
        )
    }
}

//for page size input
export class PageSizeInput extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             
        }
        this.handlePageSizeClick=this.handlePageSizeClick.bind(this);
    }
    

    handlePageSizeClick(size,e){
        Axios.get("https://ciswebapi2.cryptoindexseries.com/api/Search/CoinSearch?page_size="+size+"&page_number="+this.props.selectedPage+"&ccy=USD")
        .then(res=>{
            this.props.onPageSizeChange(res.data.data,size)
        })
        
    }

    render() {
        return (
            <DropdownButton className="pageSizeDropdown" size="lg"  drop="right" id="dropdown-basic-button" title="Page Size">
                <Dropdown.Item className="dropdownItem" href="#" onClick={(e)=>this.handlePageSizeClick(10,e)} >10</Dropdown.Item>
                <Dropdown.Item className="dropdownItem" href="#" onClick={(e)=>this.handlePageSizeClick(25,e)} >25</Dropdown.Item>
                <Dropdown.Item className="dropdownItem" href="#" onClick={(e)=>this.handlePageSizeClick(50,e)} >50</Dropdown.Item>
            </DropdownButton>
            
        )
    }
}

//for tableHeader
export class TableHeader extends Component {
    render() {
        return (
            <div>
                
            </div>
        )
    }
}

//for coin rows
export class CoinRows extends Component {
    //coins in props
    render() {
        const coins = this.props.coins;
        const coinTableList= coins.filter(l=>l.ticker!=null).map((coin)=>
            <Row 
            key={coin.coin_id}
            img_url={coin.image_url}
            symbol={coin.symbol}
            price ={coin.ticker.l}
            />
        );
        return (
            <table>
            <thead>
              <tr>
                <th className="tableHeader" colspan="2" >Name</th>
                <th className="tableHeader" >Price</th>
              </tr>
            </thead>
            <tbody>{coinTableList}</tbody>
          </table>
        )
    }
}

//for a single coin row
export class Row extends Component {
    render() {
        return (
            <tr className="tableRow">
                <td>
                   <Link to={`/coin/${this.props.symbol}`} >
                       <img src={this.props.img_url} alt={this.props.symbol} width="40" height="40" />
                    </Link>
                </td>
                <td>{this.props.symbol}</td>
                <td>{this.props.price}</td>
            </tr>
        )
    }
}

//for selecting page input
export class PaginationInput extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             
        }

        //to avoid undefined "this"
        this.handlePageClick=this.handlePageClick.bind(this);
    
    }
    
    
    handlePageClick= (data)=>{
        const pageClicked = data.selected+1;
        //now get the coins then change state
        Axios.get("https://ciswebapi2.cryptoindexseries.com/api/Search/CoinSearch?page_size="+this.props.pageSize+"&page_number="+pageClicked+"&ccy=USD")
        .then(res=>{
            this.props.onPageChange(res.data.data,pageClicked)
        })
        
    };

    render() {
        return (
            <div className="pagination">
                <ReactPaginate
                    previousLabel={'previous'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={Math.floor(this.props.totalCount/this.props.pageSize)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                />
            </div>
        )
    }
}


export default CryptoTableView
