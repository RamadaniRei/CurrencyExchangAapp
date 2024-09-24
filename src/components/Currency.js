import React, { useEffect, useState } from "react";

const apiKey = process.env.REACT_APP_API_KEY;

const BASE_URL = `http://api.exchangeratesapi.io/v1/latest?access_key=${apiKey}`;

const Currency = () => {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [exchangeRate, setExchangeRate] = useState(1); // Default exchange rate
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
  const [rates, setRates] = useState({}); // Store all exchange rates

  // Calculate from and to amounts based on the exchange rate
  const fromAmount = amountInFromCurrency ? amount : amount / exchangeRate;
  const toAmount = amountInFromCurrency ? amount * exchangeRate : amount;

  // Fetch exchange rates once on component mount
  useEffect(() => {
    fetch(BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        const firstCurrency = Object.keys(data.rates)[0];
        setCurrencyOptions([data.base, ...Object.keys(data.rates)]);
        setRates(data.rates); // Store all rates
        setFrom(data.base);
        setTo(firstCurrency);
        setExchangeRate(data.rates[firstCurrency]);
      })
      .catch((error) => {
        console.error("Error fetching exchange rates:", error);
      });
  }, []);

  // Update the exchange rate whenever `from` or `to` changes
  useEffect(() => {
    if (from != null && to != null && rates[from] && rates[to]) {
      // Calculate the exchange rate between `from` and `to`
      const newExchangeRate = rates[to] / rates[from];
      setExchangeRate(newExchangeRate);
    }
  }, [from, to, rates]); // Listen for changes in `from`, `to`, and `rates`

  return (
    <div className="counter-container">
      <div className="text-box">
        <div className="inputarea">
          <div className="navbar-container">
            <h2>CURRENCY CONVERTER</h2>
          </div>

          <div className="from">
            <input
              type="number"
              placeholder="Enter amount"
              value={fromAmount}
              onChange={(e) => {
                setAmount(e.target.value);
                setAmountInFromCurrency(true);
              }}
            />
            <select value={from} onChange={(e) => setFrom(e.target.value)}>
              {currencyOptions.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <h1>=</h1>

          <div className="to">
            <input
              type="number"
              placeholder="Enter amount"
              value={toAmount}
              onChange={(e) => {
                setAmount(e.target.value);
                setAmountInFromCurrency(false);
              }}
            />
            <select value={to} onChange={(e) => setTo(e.target.value)}>
              {currencyOptions.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Currency;
