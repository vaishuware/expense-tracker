// import logo from './logo.svg';
import { useState , useEffect} from 'react';
import './App.css';
import{
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';


function App() {
  const [transaction, setTransaction]=useState({
    title:"",
    amount:"",
    category:"",
    type:""
  });

  useEffect(() => {
  fetch("http://localhost:5000/api/expenses")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      return response.json();
    })
    .then((data) => {
      console.log("Transactions from MongoDB:", data);
      setTransactions(data);
    })
    .catch((error) => {
      console.error("Error fetching transactions:", error);
    });
}, []);
  const[transactions,setTransactions]=useState([]);

    const handleSubmit = async (e) => { 
      e.preventDefault();
      
      try { 
        const response = await fetch("http://localhost:5000/api/expenses", {
           method: "POST",
            headers: { "Content-Type": "application/json",
             },
              body: JSON.stringify({
                 title: transaction.title,
                  amount: Number(transaction.amount), 
                  category: transaction.category,
                   type: transaction.type,
               }), 
           }); 
         const data = await response.json(); 
          console.log("Backend response:", data);
                  
          if (!response.ok) { 
            throw new Error(data.message || "Failed to save transaction"); 
          }
       // Add transaction to React state only after MongoDB saves it 
    setTransactions([ 
      ...transactions
      , { ...transaction, 
        amount: Number(transaction.amount),
        },
       ]); 
      // Clear form 
    setTransaction({
       "title": "",
       "amount": "",
       "category": "",
       "type": "",
       });
     } catch (error) {
       console.error("FETCH ERROR:", error); 
      } 
    };

  /* caluculate income */
  const income = transactions.filter((transaction)=>transaction .type==="income")
  .reduce((total,transaction)=>total + transaction.amount,0);

  /* calculate expense */
  const expense = transactions.filter((transaction)=>transaction .type==="expense")
  .reduce((total,transaction)=>total + transaction.amount,0);

  /*calculate balance */
  const balance=income-expense;

  /*bar chart data */
  const summaryData =[
    {
      name:"Money",
      Income:income,
      Expense:expense
    }
  ];

  /* category data for pie chart */
  const categoryTotals={};
  transactions.filter((transaction)=>transaction.type ==="expense")
  .forEach((transaction)=>
  {
    if(categoryTotals[transaction.category]){
      categoryTotals[transaction.category]+= transaction.amount;
    } else{
      categoryTotals[transaction.category]=transaction.amount;
    }
  });
  const categoryData= Object.keys(categoryTotals).map ((category)=>({
    name: category,
    value:categoryTotals[category]
  }));

  /*expense ratio */
  const expenseRatio = income > 0?((expense/income)*100).toFixed(1):0;

  /* highest exoense category */
  let highestCategory="None";
  
  if(categoryData.length>0){
    highestCategory=categoryData.reduce((highest,current)=> current.value > highest.value? current:
      highest).name;
  }

  return (
    <div className="dashboard">
      <h1>Finance Dashboard</h1>

      <div className="summary-cards">

        <div className="card balance-card">
          <h3>Total Balance</h3>
          <h2>₹{balance.toLocaleString()}</h2>
          <p>Your current balance</p>
        </div>

        <div className="card income-card">
          <h3>Total Income</h3>
          <h2>₹{income.toLocaleString()}</h2>
          <p>Money coming in</p>
        </div>

        <div className="card expense-card">
          <h3>Total Expense</h3>
          <h2>₹.{expense.toLocaleString()}</h2>
          <p>Money going out</p>
        </div>

        <div className="card transaction-card">
          <h3>Transactions</h3>
          <h2>{transactions.length}</h2>
          <p>Total transactions</p>
        </div>

      </div>
  

    
     <div className="app">
    <h1>Expense Tracker </h1>


     <form
     className="transaction-form"
     onSubmit={handleSubmit}>
      <h2> Add Transaction</h2>
      
      <input 
      type="text"
      placeholder="Transcation title"
      value={transaction.title}
      onChange={(e)=>
        setTransaction({
          ...transaction,
          title:e.target.value
        })
      }
      />

      <input
      type="number"
      placeholder="Amount"
      value={transaction.amount}
      onChange={(e)=>
        setTransaction({
          ...transaction,
          amount:e.target.value
        })
      }
      />

      <select
       value={transaction.type}
      onChange={(e)=>
        setTransaction({
          ...transaction,
          type:e.target.value
        })
      }>
    
        <option value="">None</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

       <select
       value={transaction.category}
       onChange={(e)=>
        setTransaction({
          ...transaction,
          category:e.target.value
        })
      }>
        <option value="">None</option>
        <option value="salary">Salary</option>
        <option value="food">Food</option>
        <option value="shopping">Shopping</option>
        <option value="bills">Bills</option>
        <option value="travel">Travel</option>
        <option value="newspaper">Newspaper</option>
        <option value="other">Other</option>
      </select>

      <button type="submit">Add Transaction</button>
     </form>

     <div className="transactions">
        <h2>Transaction History</h2>
    
     {transactions.length ===0? (
      <p>No transactions yet.</p>
     ):(
      transactions.map((transaction,index)=>(
      <div key={index}
      className="transaction">
        <span>{transaction.title}</span>
        <span>{transaction.type==="income"?"+" :"-"}₹
          {transaction.amount.toLocaleString()}</span>
     </div>
     ))
     )}
     </div>

  {/*analytics */}
  <div className="analytics">
    <h2>Finaancial Analytics</h2>
    {/* income VS expenses*/}
    <div className="chart-cart">
      <h3>Income VS Expense</h3>
      <ResponsiveContainer 
      width="100%"
      height={300}
      >
        <BarChart data={summaryData}>
          <XAxis dataKey="name"/>
          <YAxis/>
          <Tooltip/>
          <Legend/>
          <Bar
          dataKey="Income"
          fill="#4CAF50"
          />
          <Bar 
          dataKey="Expense"
          fill="#F44336"
          />
        </BarChart>
       </ResponsiveContainer >
    </div>

    {/*category pie chart*/}
    <div className='chart-card'>
      <h3>Expense by Category</h3>
      {categoryData.length ===0 ?(
        <p>No expenses data yet.</p>
      ):(
        <ResponsiveContainer
        width="100%"
        height={300}
        >
          <PieChart>
          <Pie
          data={categoryData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
          >
            {categoryData.map((entry,index)=>(
              <Cell
              Key={`cell-${index}`}
                />
            ))}

          </Pie>
          <Tooltip/>
          <Legend/>
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
    {/*insights*/}
    <div className="insights">
      <h2>Insights</h2>
      <p>Savings:₹ {balance.toLocaleString()}</p>
      <p>Expense Ratio:{expenseRatio}%</p>
      <p>Highest Spending Category:{highestCategory}</p>
      <p>Total Transactions: {transactions.length}</p>
    </div>
  </div>
 </div></div>
 );
}

export default App;
