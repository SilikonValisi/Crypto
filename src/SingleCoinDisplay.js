import React, { Component} from 'react'
import Axios from 'axios';
import './SingleCoinDisplay.css'

export class SingleCoinDisplay extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             isLoading:true,coin:undefined,
             price:0
        }

    }
    
    componentDidMount(){


        Axios.get(`https://ciswebapi2.cryptoindexseries.com/api/Search/CoinSearch?coin_symbols=${this.props.match.params.symbol}&ccy=USD`)
        .then(res=>{
            this.setState({coin:res.data.data[0],isLoading:false})
            // this.setState({isLoading:false})
        })
        this.props.socket.emit("m", {action: "subscribe", data: [`${this.props.match.params.symbol}-USD.CISCALC~TICKER`]});
        this.props.socket.on("m",(m)=>{
            try {
                var obj = JSON.parse(m);
                this.setState({price:obj.l})
            } catch (error) {
                //sends "OK|SUB|BTC-USD.CISCALC~TICKER" didnt know what to do with it
                
            }
        })

    }

    componentWillUnmount(){
        this.props.socket.emit("m", {action: "unsubscribe", data: [`${this.props.match.params.symbol}-USD.CISCALC~TICKER`]});
        this.props.socket.removeAllListeners("m");
    }

    render() {
        const {isLoading,coin} = this.state;

        if(isLoading){
            return <div>Loading</div>
        }

        return (
            <div className="singleCoinDisplay">
                <img className="item" src={coin.image_url} alt="" height="60" width="60" /> 
                <div>
                    <p className="item symbol">{coin.symbol} </p>
                    <p className="item name">{coin.name} </p>
                </div>
                <div>
                    <p className="price" >Price </p>
                    <p className="item">{this.state.price} </p>
                </div>
                
            </div>
        )
    }
}

export default SingleCoinDisplay
