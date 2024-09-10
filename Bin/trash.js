// userSchema.virtual('isLocked').get(function() {
//     return !!(this.lockUntil && this.lockUntil > Date.now());
// });
// userSchema.methods.lockAccount = async function (password) {
// 	if (this.isLocked)
// 		return 0;
// 	// password là mật khẩu người nhập vào sau đó check 
// 	//với this.password tức mật khẩu  đã được hash lúc đăng ký trước đó và ở trên ngược lại
// 	const isMatch = await bcrypt.compare(this.password,password);
// 	if(!isMatch){

// 		this.loginAttempts++
// 		if (this.loginAttempts > 3) {
// 			this.lockUntil = Date.now() + 300000
// 		}
// 			await this.save();
// 	}else{
// 			this.loginAttempts = 0;
// 			this.lockUntil =1
// 			await this.save();
// 	}
// 	console.log(this.isLocked)
// }
// loginAttempts: { type: Number, default: 0 },
// lockUntil: { type: Number },
// isLockedByAdmin: { type: Boolean, default: false }
// },
let response;
response = await Post.find({ approver: "Accepted" })
.populate('postedBy', 'username -_id')
.select('-approver')
.sort({ createdAt: -1 });
console.log(response);
const query = {  title: { $regex: Search, $options:'i' } }
if(Search) {
    response = await Post.find({query, approver: "Accepted" })
    .populate('postedBy', 'username -_id')
    .select('-approver')
    .sort({ createdAt: -1 });
    console.log(1)
} else {
  
console.log(2);
}

return {
    status: response? 200 : 401,
    message: response? "success" : "Not Found ",
    data: response,
}

import express from'express';

// Create an Express application
const app = express();

// Define a route for the homepage
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Define the port number
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
/*


dotenv.config();
app.use(Express.json());
ConnectDB();
app.use(Express.urlencoded({ extended: true }));
app.use(cookieParser());
initRouter(app);

app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(openApiSpecification)
);
 */