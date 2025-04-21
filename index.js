import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 4000;

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.use(express.static("public"));

// In-memory data store
let posts = [
  {
    id: 1,
    title: "The Rise of Decentralized Finance",
    content:
      "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
    author: "Alex Thompson",
    date: "2023-08-01T10:00:00Z",
  },
  {
    id: 2,
    title: "The Impact of Artificial Intelligence on Modern Businesses",
    content:
      "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
    author: "Mia Williams",
    date: "2023-08-05T14:30:00Z",
  },
  {
    id: 3,
    title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
    content:
      "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
    author: "Samuel Green",
    date: "2023-08-10T09:15:00Z",
  },
];

let lastId = 3;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Write your code here//

//CHALLENGE 1: GET All posts (http://localhost:4000/posts)
app.get("/posts", async (req, res) => {
  // send the array of posts in the response (in this case, to server.js)
  res.json(posts);
});

//CHALLENGE 2: GET a specific post by id (http://localhost:4000/posts/:id)
app.get("/posts/:id", async (req, res) => {
  // retrieve the id from the query parameters
  let id = req.params.id;
  console.log(`typeof(${id}) = `, typeof id);
  id = Number(id);
  console.log(`typeof(${id}) = `, typeof id);
  if (Number.isNaN(id)) {
    // id is not a number, throw an error
    res.send({
      error: `${id} is not a number. Please enter a numeric value for the post's id.`,
    });
  } else {
    // variable that will store the post with the specified id (if found)
    let postById;
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].id === id) {
        // store the post with specified id in the postById variable
        postById = posts[i];
        break;
      }
    }
    if (typeof postById === "undefined") {
      // No post with the specified id exists
      res.json({
        error: `There is no post with id = ${id}`,
      });
    } else {
      // send the post with id = id in the response
      res.json(postById);
    }
  }
});

//CHALLENGE 3: POST a new post (http://localhost:4000/posts)
app.post("/posts", async (req, res) => {
  // debugging
  console.log("req.body = ", req.body);

  // check to see if the necessary feilds (title, contant, & author)
  // are in the request object
  if (Object.keys(req.body).length === 0) {
    res.json({
      error: `POST /posts: title, content, & author not sent in the request for the newly created post.`,
    });
  }
  // check if "title", "content", & "author" are in the body
  else if (
    req.body.hasOwnProperty("title") &&
    req.body.hasOwnProperty("content") &&
    req.body.hasOwnProperty("author")
  ) {
    if (
      req.body.title.trim().length === 0 ||
      req.body.content.trim().length === 0 ||
      req.body.author.trim().length === 0
    ) {
      // at least 1 of the 3 necessary fields to create a new post is an empty string
      res.json({
        error: `POST /posts: Add a title AND some content AND an author for the newly created post.`,
      });
    } else {
      let newPost = {
        // in a real application, the database would randomly generate the id
        id: posts.length + 1,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
      };

      // In a real application, the newPost would be sent to the database but this "applictaion"
      // has no database so I'll "append" it to the posts array.
      posts.push(newPost);
      // send the newly created post in the response
      res.json(newPost);
    }
  } else {
    //
    res.json({
      error: `POST /posts: Add a title, some content, & an author's name to the post you would like to add`,
    });
  }
});

//CHALLENGE 4: PATCH a post when you just want to update one parameter (http://localhost:4000/posts/:id)
app.patch("/posts/:id", async (req, res) => {
  // updates the post with the specified id
  // retrieve the id from the query parameters
  let id = req.params.id;
  console.log(`typeof(${id}) = `, typeof id);
  id = Number(id);
  console.log(`typeof(${id}) = `, typeof id);

  if (Number.isNaN(id)) {
    // id is not a number, throw an error
    res.send({
      error: `${id} is not a number. Please enter a numeric value for the id.`,
    });
  } else {
    if (Object.keys(req.body).length === 0) {
      // for some reason, the content for the blog was not in the body of the request
      res.json({
        error: `PATCH /posts/${id}: add some text to update this blog post.`,
      });
    }
    // check to see if 'title', 'content', or 'author' are in the body of the request
    else if (
      req.body.hasOwnProperty("title") ||
      req.body.hasOwnProperty("content") ||
      req.body.hasOwnProperty("author")
    ) {
      // debugging purposes
      let body = req.body;
      console.log("request's body = ", body);

      if (
        (typeof req.body.title !== "string" ||
          req.body.title.trim().length === 0) &&
        (typeof req.body.content !== "string" ||
          req.body.content.trim().length === 0) &&
        (typeof req.body.author !== "string" || req.body.author.trim() === 0)
      ) {
        // the text AND the title, content, & author are ALL empty strings
        res.send({
          error: `PATCH: /jokes/${id}: Please add a \'title\' OR some \'content\' OR an \'author\' for the post with id = ${id} so it can be updated.`,
        });
      } else {
        // variable that will store the post with the specified id (if found)
        let postById;
        for (let i = 0; i < posts.length; i++) {
          if (posts[i].id === id) {
            // store the post with specified id in the postById variable
            postById = posts[i];
            break;
          }
        }

        console.log("PATCH: postById = ", postById);

        // check to see if a joke with that id actually exists
        if (typeof postById === "undefined") {
          res.json({
            error: `Can't update post with id ${id} because it does not exist.`,
          });
        } else {
          // In a real application, the postById's new fields would be sent to the database but this "applictaion"
          // has no database so I'll just "modify" all the fields in postById.

          // update postById's text and type

          // Edge cases for scenarios where a user updates the title OR the content OR the author,
          // only the tile OR the author OR the content fields exists.
          // check to see if 'title' field exists
          if (typeof req.body.title !== "undefined") {
            // only update the title if it's not an empty string
            if (req.body.title.trim().length !== 0) {
              postById.title = req.body.title;
            }
          }
          // check to see if content field exists
          if (typeof req.body.content !== "undefined") {
            // update the content if it's not an empty string
            if (req.body.content.trim().length !== 0) {
              postById.content = req.body.content;
            }
          }

          // check to see if author field exists
          if (typeof req.body.author !== "undefined") {
            // update the content if it's not an empty string
            if (req.body.author.trim().length !== 0) {
              postById.author = req.body.author;
            }
          }

          // return the post with id = id
          res.send(postById);
        }
      }
    }
  }
});

//CHALLENGE 5: DELETE a specific post by providing the post id. (http://localhost:4000/posts/:id)
app.delete("/posts/:id", async (req, res) => {
  // retrieve the id from the query parameters
  let id = req.params.id;
  console.log(`typeof(${id}) = `, typeof id);
  id = Number(id);
  console.log(`typeof(${id}) = `, typeof id);
  if (Number.isNaN(id)) {
    // id is not a number, throw an error
    res.send({
      error: `${id} is not a number. Please enter a numeric value for the post's id.`,
    });
  } else {
    // remove the post with the specified id
    // findIndex() returns the index of the post with the specified id; if -1 is returned,
    // then that means that there is no element in the array with that id
    const index = posts.findIndex((post) => post.id === id);

    if (index !== -1) {
      // post with specified exists
      // remove the post with the specified id
      posts.splice(index, 1);
      res.status(200).send("OK");
    } else {
      // no joke with the specifed id
      res.json({
        error: `Can't delete post with id ${id} because it does not exist.`,
      });
    }
  }
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
