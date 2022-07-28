import "./App.css";
import React, { useEffect, useState } from "react";
import CurrencyRow from "./CurrencyRow";

const BASE_URL =
  "https://v6.exchangerate-api.com/v6/9ab295164d7d60a30cb32d21/latest/USD";

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [amount, setAmount] = useState(1);
  const [amountFromCurrency, setAmountFromCurrency] = useState(true);
  const [exchangeRate, setExchangeRate] = useState();
  // console.log(exchangeRate);

  // console.log(currencyOptions);

  let toAmount, fromAmount;
  if (amountFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  useEffect(() => {
    fetch(BASE_URL).then((res) =>
      res.json().then((data) => {
        const firstCurrency = Object.keys(data.conversion_rates)[0];
        setCurrencyOptions([
          data.base_code,
          ...Object.keys(data.conversion_rates),
        ]);
        setFromCurrency(data.base_code);
        setToCurrency(firstCurrency);
        setExchangeRate(data.conversion_rates[firstCurrency]);
      })
    );
  }, []);

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
        .then((res) => res.json())
        .then((data) => setExchangeRate(data.conversion_rates[toCurrency]));
    }
  }, [fromCurrency, toCurrency]);

  function handleFromOnChangeAmount(e) {
    setAmount(e.target.value);
    setAmountFromCurrency(true);
  }

  function handleToOnChangeAmount(e) {
    setAmount(e.target.value);
    setAmountFromCurrency(false);
  }

  return (
    <div className="App">
      <h1> Currency Converter </h1>{" "}
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={(e) => setFromCurrency(e.target.value)}
        amount={fromAmount}
        onChangeAmount={handleFromOnChangeAmount}
      />{" "}
      <div className="equals">= </div>{" "}
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={(e) => setToCurrency(e.target.value)}
        amount={toAmount}
        onChangeAmount={handleToOnChangeAmount}
      />{" "}
    </div>
  );
}

export default App;
