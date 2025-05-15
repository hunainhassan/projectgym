let user = require("../collection/User");
let b = require("bcrypt");

// 🆕 Import the models
const Workout = require("../Models/Workout");
const FoodLog = require("../Models/FoodLog");
const Progress = require("../Models/Progress");

let user_function = {
  // -------- USER ROUTES --------
  register: async function (req, res) {
    try {
      let {
        name,
        email,
        password,
        gender,
        age,
        contact,
        height,
        weight,
        bmi_index,
        target_weight,
        bp,
        diabities
      } = req.body;

      let email_check = await user.findOne({ email: email });
      if (email_check) {
        return res.status(409).json({ msg: "Email Already exist" });
      } else {
        let enc_pswd = b.hashSync(password, 15);

        let user_data = new user({
          name,
          email,
          password: enc_pswd,
          gender,
          age,
          contact,
          height,
          weight,
          bmi_index,
          target_weight,
          bp,
          diabities
        });

        await user_data.save();
        return res.status(200).json({ msg: "User registered successfully" });
      }
    } catch (error) {
      return res.status(501).json({ msg: error.message });
    }
  },

  get_all_user: async function (req, res) {
    try {
      let user_record = await user.find().select("-password").sort({ record_at: -1 });
      return res.status(200).json(user_record);
    } catch (error) {
      return res.status(501).json({ msg: error.message });
    }
  },

  delete_user: async function (req, res) {
    try {
      let { id } = req.params;
      let find_id = await user.findById(id);
      if (find_id) {
        await user.findByIdAndDelete(find_id);
        return res.status(200).json({ msg: "User Deleted Successfully" });
      }
    } catch (error) {
      return res.status(501).json({ msg: error.message });
    }
  },

  update_record: async function (req, res) {
    try {
      let { id } = req.params;
      let {
        name,
        email,
        age,
        gender,
        contact,
        height,
        weight,
        bmi_index,
        target_weight,
        bp,
        diabities
      } = req.body;

      let id_exist = await user.findById(id);
      if (id_exist) {
        let update_data = {
          name,
          email,
          age,
          gender,
          contact,
          height,
          weight,
          bmi_index,
          target_weight,
          bp,
          diabities
        };

        await user.findByIdAndUpdate(id, update_data);
        return res.status(200).json({ msg: "User updated successfully" });
      }
    } catch (error) {
      return res.status(501).json({ msg: error.message });
    }
  },

  login: async function (req, res) {
    try {
      let { email, password } = req.body;

      let user_data = await user.findOne({ email: email });
      if (!user_data) {
        return res.status(401).json({ msg: "Invalid Email or Password" });
      }

      let isMatch = await b.compare(password, user_data.password);
      if (!isMatch) {
        return res.status(401).json({ msg: "Invalid Email or Password" });
      }

      let { password: _, ...userWithoutPassword } = user_data.toObject();
      return res.status(200).json({ msg: "Login Successful", user: userWithoutPassword });

    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  // -------- WORKOUT ROUTES --------
  addWorkout: async (req, res) => {
    try {
      console.log("Workout request body:", req.body); // 🔍 Add this
      const { userId, exercises } = req.body;
  
      const newWorkout = new Workout({ userId, exercises });
      await newWorkout.save();
  
      res.status(201).json({ msg: "Workout saved", data: newWorkout });
    } catch (err) {
      console.error("Workout save error:", err); // 🔍 Add this
      res.status(500).json({ msg: err.message });
    }
  },
  

  getWorkouts: async (req, res) => {
    try {
      const { userId } = req.query;
      const workouts = await Workout.find({ userId });
      res.json(workouts);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  updateWorkout: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedWorkout = await Workout.findByIdAndUpdate(id, req.body, { new: true });
      res.json({ msg: "Workout updated", data: updatedWorkout });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  deleteWorkout: async (req, res) => {
    try {
      const { id } = req.params;
      await Workout.findByIdAndDelete(id);
      res.json({ msg: "Workout deleted" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  // -------- FOOD LOG ROUTES --------
  addFood: async (req, res) => {
    try {
      const { userId, meals } = req.body;
      const newFoodLog = new FoodLog({ userId, meals });
      await newFoodLog.save();
      res.status(201).json({ msg: "Food log saved", data: newFoodLog });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  getFoods: async (req, res) => {
    try {
      const { userId } = req.query;
      const foodLogs = await FoodLog.find({ userId });
      res.json(foodLogs);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  updateFood: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedFood = await FoodLog.findByIdAndUpdate(id, req.body, { new: true });
      res.json({ msg: "Food log updated", data: updatedFood });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  deleteFood: async (req, res) => {
    try {
      const { id } = req.params;
      await FoodLog.findByIdAndDelete(id);
      res.json({ msg: "Food log deleted" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  // -------- PROGRESS ROUTES --------
  addProgress: async (req, res) => {
    try {
      const { userId, weight, bodyFat, chest, waist, hips } = req.body;
      const newProgress = new Progress({ userId, weight, bodyFat, chest, waist, hips });
      await newProgress.save();
      res.status(201).json({ msg: "Progress saved", data: newProgress });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  getProgress: async (req, res) => {
    try {
      const { userId } = req.query;
      const progress = await Progress.find({ userId });
      res.json(progress);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  updateProgress: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedProgress = await Progress.findByIdAndUpdate(id, req.body, { new: true });
      res.json({ msg: "Progress updated", data: updatedProgress });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  deleteProgress: async (req, res) => {
    try {
      const { id } = req.params;
      await Progress.findByIdAndDelete(id);
      res.json({ msg: "Progress deleted" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
  
};

module.exports = user_function;
