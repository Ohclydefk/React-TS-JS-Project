const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 8081;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "goatmez",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

app.post("/add_user", (request, response) => {
  const { username, password, cpassword, fname, lname, phone, date, gender } =
    request.body;

  let profile_picture;

  if (request.file) {
    const imagePath = request.file.path;
    profile_picture = fs.readFileSync(imagePath);
  } else {
    profile_picture = fs.readFileSync("./frontend/src/assets/profile.png");
  }

  const sql =
    "INSERT INTO accounts (username, password, cpassword, fname, lname, phone, date, gender, profile_picture) VALUES (?,?,?,?,?,?,?,?,?)";

  db.query(
    sql,
    [
      username,
      password,
      cpassword,
      fname,
      lname,
      phone,
      date,
      gender,
      profile_picture,
    ],
    (error, result) => {
      if (error) {
        console.error("Error adding user:", error);
        response.status(500).send("Error adding user");
      } else {
        response.status(200).send("User Added");
      }
    }
  );
});

app.post("/login", (request, response) => {
  const { username, password } = request.body;
  const sql = "SELECT * FROM accounts WHERE username = ?";

  db.query(sql, [username], (error, result) => {
    if (error) {
      console.error("Error querying the database:", error);
      response.status(500).json({ message: "Internal Server Error" });
      return;
    }

    if (result.length > 0) {
      const user = result[0];
      if (user.password === password) {
        response.json({ message: "Login successful", user });
      } else {
        response.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      response.status(401).json({ message: "Invalid credentials" });
    }
  });
});

app.get("/user/:user_id", (request, response) => {
  const user_id = request.params.user_id;
  const sql = "SELECT * FROM accounts WHERE user_id=?";
  db.query(sql, [user_id], (error, data) => {
    if (error) {
      console.error(error);
      return response.status(500).json({ message: "Internal Server Error" });
    }

    if (data.length > 0) {
      const user = data[0];
      const profilePictureDataUrl = user.profile_picture
        ? `data:image/png;base64,${Buffer.from(
            user.profile_picture,
            "binary"
          ).toString("base64")}`
        : "/src/assets/profile.png";
      const userDataWithImageUrl = {
        ...user,
        profile_picture: profilePictureDataUrl,
      };

      response.json(userDataWithImageUrl);
    } else {
      response.status(404).json({ message: "User not found" });
    }
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

app.post("/upload", upload.single("image"), (req, res) => {
  let uploadImage;
  const imagePath = req.file.path;
  const user_id = req.body.user_id;
  const post_desc = req.body.post_desc;
  uploadImage = fs.readFileSync(imagePath);

  const sql = "INSERT INTO posts (post_img, user_id, post_desc) VALUES (?,?,?)";
  db.query(sql, [uploadImage, user_id, post_desc], (err, result) => {
    if (err) {
      console.error("Error inserting post:", err);
      return res.json({ Status: "error" });
    }
    return res.json({ Status: "success" });
  });
});

app.get("/display_all", (request, response) => {
  const page = request.query.page || 1; // default to page 1
  const postsPerPage = 10; // adjust as needed

  const offset = (page - 1) * postsPerPage;

  const sql = `
  SELECT posts.*, accounts.fname, accounts.lname, accounts.profile_picture 
  FROM posts
  JOIN accounts ON posts.user_id = accounts.user_id
  WHERE posts.hidden = FALSE
  ORDER BY posts.post_id DESC
  LIMIT ?, ?;
`;

  db.query(sql, [offset, postsPerPage], (error, result) => {
    if (error) {
      console.error(error);
      return response.status(500).json({ message: "Internal Server Error" });
    }

    if (result.length > 0) {
      // Same response processing as before
      const posts = result.map((post) => ({
        post_id: post.post_id,
        user_id: post.user_id,
        post_desc: post.post_desc,
        post_img: post.post_img
          ? `data:image/png;base64,${Buffer.from(
              post.post_img,
              "binary"
            ).toString("base64")}`
          : null,
        fname: post.fname,
        lname: post.lname,
        profile_picture: post.profile_picture
          ? `data:image/png;base64,${Buffer.from(
              post.profile_picture,
              "binary"
            ).toString("base64")}`
          : "/src/assets/profile.png",
      }));

      response.json(posts);
    } else {
      response.status(404).json({ message: "No posts found" });
    }
  });
});

app.get("/display_specific/:user_id", (request, response) => {
  const user_id = request.params.user_id;

  const userSql = "SELECT * FROM accounts WHERE user_id=?";
  db.query(userSql, [user_id], (userError, userData) => {
    if (userError) {
      console.error("Error fetching user data:", userError);
      return response.status(500).json({ message: "Internal Server Error" });
    }

    if (userData.length > 0) {
      const user = userData[0];

      const postSql =
        "SELECT * FROM posts WHERE user_id=? AND hidden = FALSE ORDER BY post_id DESC";
      db.query(postSql, [user_id], (postError, postData) => {
        if (postError) {
          console.error("Error fetching post data:", postError);
          return response
            .status(500)
            .json({ message: "Internal Server Error" });
        }

        const userDataWithImageUrl = {
          ...user,
          profile_picture: user.profile_picture
            ? `data:image/png;base64,${Buffer.from(
                user.profile_picture,
                "binary"
              ).toString("base64")}`
            : "/src/assets/profile.png",
          posts: postData.map((post) => ({
            ...post,
            post_img: post.post_img
              ? `data:image/png;base64,${Buffer.from(
                  post.post_img,
                  "binary"
                ).toString("base64")}`
              : null,
          })),
        };
        response.json(userDataWithImageUrl);
      });
    } else {
      console.log("User not found for ID:", user_id);
      response.status(404).json({ message: "User not found" });
    }
  });
});

app.put("/upload", upload.single("image"), (req, res) => {
  let uploadImage;
  const imagePath = req.file ? req.file.path : null;
  const post_id = req.body.post_id;
  const post_desc = req.body.post_desc;

  if (imagePath && post_desc) {
    uploadImage = fs.readFileSync(imagePath);

    const sql =
      "UPDATE posts SET post_img = ?, post_desc = ? WHERE post_id = ?";
    db.query(sql, [uploadImage, post_desc, post_id], (err, result) => {
      if (err) {
        console.error("Error updating post:", err);
        return res.json({ Status: "error" });
      }
      return res.json({ Status: "success" });
    });
  } else if (imagePath) {
    uploadImage = fs.readFileSync(imagePath);

    const sql = "UPDATE posts SET post_img = ? WHERE post_id = ?";
    db.query(sql, [uploadImage, post_id], (err, result) => {
      if (err) {
        console.error("Error updating post image:", err);
        return res.json({ Status: "error" });
      }
      return res.json({ Status: "success" });
    });
  } else if (post_desc) {
    const sql = "UPDATE posts SET post_desc = ? WHERE post_id = ?";
    db.query(sql, [post_desc, post_id], (err, result) => {
      if (err) {
        console.error("Error updating post description:", err);
        return res.json({ Status: "error" });
      }
      return res.json({ Status: "success" });
    });
  } else {
    return res.json({
      Status: "error",
      Message: "No data provided for update",
    });
  }
});

app.post("/hide_post/:post_id", (request, response) => {
  const post_id = request.params.post_id;

  const sql = "UPDATE posts SET hidden = TRUE WHERE post_id = ?";

  db.query(sql, [post_id], (error, result) => {
    if (error) {
      console.error("Error hiding post:", error);
      return response.status(500).json({ message: "Internal Server Error" });
    }

    response.json({ Status: "success" });
  });
});

app.put("/edit_user", upload.single("image"), (req, res) => {
  let uploadImage;
  const imagePath = req.file ? req.file.path : null;
  const { username, password, cpassword, fname, lname, phone, date, gender } =
    req.body;
  const user_id = req.body.user_id;

  if (imagePath) {
    uploadImage = fs.readFileSync(imagePath);
  }

  const updateFields = [];
  const updateValues = [];

  if (uploadImage) {
    updateFields.push("profile_picture = ?");
    updateValues.push(uploadImage);
  }

  if (username) {
    updateFields.push("username = ?");
    updateValues.push(username);
  }

  if (password) {
    updateFields.push("password = ?");
    updateValues.push(password);

    updateFields.push("cpassword = ?");
    updateValues.push(password);
  }

  if (fname) {
    updateFields.push("fname = ?");
    updateValues.push(fname);
  }

  if (lname) {
    updateFields.push("lname = ?");
    updateValues.push(lname);
  }

  if (phone) {
    updateFields.push("phone = ?");
    updateValues.push(phone);
  }

  if (date) {
    updateFields.push("date = ?");
    updateValues.push(date);
  }

  if (gender) {
    updateFields.push("gender = ?");
    updateValues.push(gender);
  }

  const sql = `UPDATE accounts SET ${updateFields.join(
    ", "
  )} WHERE user_id = ?`;

  const params = [...updateValues, user_id];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.json({ Status: "error" });
    }
    return res.json({ Status: "success" });
  });
});
app.delete("/delete_post/:postId", (req, res) => {
  const postId = req.params.postId;
  const sql = "DELETE FROM posts WHERE post_id = ?";

  db.query(sql, [postId], (err, result) => {
    if (err) {
      console.error("Error deleting post:", err);
      return res.json({ Status: "error" });
    }

    console.log("Post deleted successfully:", result);
    return res.json({ Status: "success" });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
