//HTML CONTENT FOR WIDGET PREVIEW
const widgetContainer = document.createElement("div");
widgetContainer.classList.add("widgetContainer");
const coinHeading = document.createElement("section");
coinHeading.innerHTML = "<h3>coin heading</h3>";
widgetContainer.appendChild(coinHeading);
const coinDetailsContainer = document.createElement("div");
coinDetailsContainer.classList.add("coinDetailsContainer");
widgetContainer.appendChild(coinDetailsContainer);
const coinPrice = document.createElement("section");
const coinMarketCap = document.createElement("section");
const coin24_volume = document.createElement("section");
coinDetailsContainer.appendChild(coinPrice);
coinDetailsContainer.appendChild(coinMarketCap);
coinDetailsContainer.appendChild(coin24_volume);

document.body.appendChild(widgetContainer);

//HTML CONTENT FOR WIDGET FORM
const mainContainer = document.createElement("div");
const selectField = document.createElement("select");
const currencySelectField = document.createElement("select");
var currency = "btc";
currencySelectField.classList.add("currency");
mainContainer.classList.add("widgetForm");


//HTML for script result:
const finalScript = document.createElement("p");
finalScript.classList.add("result");
mainContainer.appendChild(selectField);
mainContainer.appendChild(currencySelectField);
document.body.appendChild(mainContainer);
document.body.appendChild(finalScript);

//CSS FOR THE WIDGET
const styles = document.createElement("style");
styles.innerHTML = `
    body{
        margin : 0;
        padding : 0
        font-family : Tahoma, sans-serif;
        font-size : large;
    }

    .widgetContainer{
        width : 60%;
        display : block;
        margin : 0 auto;
        background-color : #F3EEEA;
        border-radius : 2vw;
        padding : 2vw;
        margin : 2vw auto;
    }
    .widgetContainer section{
        display : flex;
        align-items : center;
        justify-content : center;
        row-gap : 1vw;
    }

    .coinDetailsContainer{
        display : flex;
        flex-direction : row;
        justify-content : center;
        align-items : center;
        column-gap : 3vw;
        padding : 2vw 0;
    }

    .coinDetailsContainer section{
        display : block;
    }
    .widgetForm{
        text-align : center;
        padding : 2vw 0;
    }

    .widgetForm select{
        outline : none;
        width : 20%;
        height : 5vh;
        border: 2px solid #F5F7F8;
        border-radius : 0.2vw;
        font-size : 1vw; 
    }
    .widgetForm select:first-child
    {
        margin-right : 10px;
    }
    img{
        margin-right : 10px;
    }
    .result{
        width : 60%;
        text-align : center;
        font-size : large;
        display : block;
        margin : 0 auto;
    }
`
document.head.append(styles);

//JAVASCRIPT LOGIC FOR THE WIDGET
const baseURL = "https://api.coingecko.com/api/v3";
const coinOptions = document.querySelector("select");
const currencyOptions = document.querySelector(".currency");
var currencyURL = `${baseURL}/coins/markets?vs_currency=inr`;
var ids = "bitcoin";
var market_cap = false;
var vol_24 = false;
var coinDetailsURL = `${baseURL}/coins/markets?vs_currency=${currency}&ids=${ids}`;

async function getCurrency()
{
    const options = {
        method : "GET",
        headers : {
            "Content-Type" : "application/json"
        }
    } 
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/supported_vs_currencies` , options);
    const currencies = await response.json();
    return currencies;
}

getCurrency()
.then(currencies => {
    
    let i = 0;
    while(i < currencies.length)
    {
        let option = document.createElement("option");
        option.text = currencies[i];
        option.value = currencies[i];
        currencyOptions.add(option);
        i++;
    }
})
.catch(error=>console.log(error));

async function getCoins()
{
    const options = {
        method : "GET",
        headers : {
            "Content-Type" : "application/json"
        }
    } 
    
    const response = await fetch(`${currencyURL}` , options);
    const coins = await response.json();
    return coins;
}




getCoins()
.then(coins => {
    
    let i = 0;
    while(i < coins.length)
    {
        let option = document.createElement("option");
        option.text = coins[i].name;
        option.value = coins[i].name;
        coinOptions.add(option);
        i++;
    }
})
.catch(error=>console.log(error))

async function coinDetails()
{
    const options = {
        method : "GET",
        headers : {
            "Content-Type" : "application/json"
        }
    } 
    
    const response = await fetch(`${coinDetailsURL}` , options);
    const coinsDetails = await response.json();
    return coinsDetails;   
}

function getDetailsCoins()
{
    coinDetails()
    .then(coinDetails => {
        if(coinDetails.length > 0)
        {
            
            coinHeading.innerHTML = `<img src=${coinDetails[0].image} width='50px' height='50px'> ${coinDetails[0].name}`;
            coinPrice.innerHTML = `Current Price <br> <b>${coinDetails[0].current_price} ${currency.toUpperCase()}</b>`;
            coinMarketCap.innerHTML = `Market Cap <br> <b>${coinDetails[0].market_cap} ${currency.toUpperCase()}</b>`;
            coin24_volume.innerHTML = `24 hr trading Volume <br> <b>${coinDetails[0].total_volume} ${currency.toUpperCase()}</b>`;
        }
        else{
            alert("😭 No results found ! please try again");
        }
    })
    .catch(error => {
        console.error(error);
        alert("🚫 Some Error Occured !");
    });
}

currencySelectField.addEventListener("change", () => {
    currency = currencySelectField.value;
    coinDetailsURL = `${baseURL}/coins/markets?vs_currency=${currency}&ids=${ids}`;
    getDetailsCoins();
});

selectField.addEventListener("change", () => {
    ids = selectField.value.toLowerCase();
    coinDetailsURL = `${baseURL}/coins/markets?vs_currency=${currency}&ids=${ids}`;
    getDetailsCoins();
});

getDetailsCoins();

finalScript.textContent = `${window.location.protocol}//${window.location.hostname}/gecko.js`;
