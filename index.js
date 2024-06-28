const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db"); //connect to the postgres (can add, edit, delete data)

//middleware
app.use(cors()); // allow cross origin and prevent cors errors
app.use(express.json()); //allow receiving json from req.body


//TODO ROUTES//

//create todo
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );

    res.json(newTodo.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

//get all todos
app.get("/todos", async (req, res) => {
  try {
    //get all data from todo database
    const allTodos = await pool.query("SELECT * from todo");
    res.json(allTodos.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//get single todo
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params; //get id from url parameter
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
    //select only the first row (relevant data)
    res.json(todo.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

//update a todo
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2",
      [description, id] //$1 and $2 are placeholders
    );
    res.json({ msg: "todo was updated" });
  } catch (err) {
    console.log(err.message);
  }
});

//delete a todo
app.delete("/todos/:id", async(req,res) => {
  try {
    const {id} = req.params;
    const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id])
    res.json({msg:"todo was deleted"})
  } catch (err) {
    console.log(err.message)
  }
})


//listen server on port 5000
app.listen(5000, () => {
  console.log("server has started on port 5000");
});
