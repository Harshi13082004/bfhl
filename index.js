const express = require("express");
const app = express();

app.use(express.json());

// Replace defaults or set environment variables USER_ID, EMAIL, ROLL
const USER_ID = process.env.USER_ID || "t_aishu_29082002";
const EMAIL = process.env.EMAIL || "aishu@example.com";
const ROLL = process.env.ROLL || "21BCE1234";

app.post("/bfhl", (req, res) => {
  try {
    const data = req.body && req.body.data;
    if (!Array.isArray(data)) {
      return res.json({
        is_success: false,
        user_id: USER_ID,
        email: EMAIL,
        roll_number: ROLL,
        odd_numbers: [],
        even_numbers: [],
        alphabets: [],
        special_characters: [],
        sum: "0",
        concat_string: "",
        error: 'Invalid input: "data" should be an array'
      });
    }

    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0;

    for (const raw of data) {
      const item = raw === null || raw === undefined ? "" : String(raw);

      // Numbers: only digits (examples expect this behavior)
      if (/^\d+$/.test(item)) {
        const n = parseInt(item, 10);
        if (n % 2 === 0) even_numbers.push(item); // keep as string
        else odd_numbers.push(item);
        sum += n;
      }
      // Alphabets: letters only
      else if (/^[a-zA-Z]+$/.test(item)) {
        alphabets.push(item.toUpperCase());
      }
      // Everything else: special characters (or mixed)
      else {
        special_characters.push(item);
      }
    }

    // concat_string: join alphabets (already uppercase), reverse, alternating caps (start with UPPER)
    const concatAll = alphabets.join("");
    const reversed = concatAll.split("").reverse().join("");
    let concat_string = "";
    for (let i = 0; i < reversed.length; i++) {
      const ch = reversed[i];
      concat_string += (i % 2 === 0) ? ch.toUpperCase() : ch.toLowerCase();
    }

    return res.json({
      is_success: true,
      user_id: USER_ID,
      email: EMAIL,
      roll_number: ROLL,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum),      // sum as a string (required)
      concat_string
    });
  } catch (err) {
    return res.json({
      is_success: false,
      user_id: USER_ID,
      email: EMAIL,
      roll_number: ROLL,
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: "",
      error: err.message
    });
  }
});

// (optional) quick GET to verify service metadata
app.get("/bfhl", (req, res) => {
  res.json({ user_id: USER_ID, email: EMAIL, roll_number: ROLL });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
