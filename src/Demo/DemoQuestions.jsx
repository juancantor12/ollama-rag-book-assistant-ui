const demoQuestions = [
    { 
        id: 0, 
        text: "" ,
        answer: "",
        references: [],
        highlight: ""
    },
    { 
        id: 1, 
        text: "What is the Widrow Hoff rule?" ,
        answer: "The Widrow-Hoff rule, also known as the delta rule or the least mean squares (LMS) algorithm, is a method used in machine learning and neural networks for updating weights. It's an iterative procedure aimed at minimizing the error between the desired output and the actual output of the network.\n\nHere are some key aspects:\n\n1. **Objective**: The goal is to minimize the squared error between the predicted values (outputs) and the target values (desired outputs).\n\n2. **Update Rule**: For a given training example \\((x, y)\\), where \\(x\\) is the input vector, \\(y\\) is the target output, \\(w\\) represents the weight vector, and \\(h_w(x) = w \\cdot x\\) is the hypothesis or predicted output:\n   \\[\n   w_i \\leftarrow w_i + \\alpha (y - h_w(x)) \\times x_i\n   \\]\n   Here, \\(i\\) indexes the components of the input vector \\(x\\), and \\(\\alpha\\) is the learning rate, a small positive constant that controls the size of weight updates.\n\n3. **Gradient Descent**: The rule can be seen as performing gradient descent on the mean squared error cost function with respect to the weights.\n\n4. **Applications**: Widrow-Hoff is commonly used in linear regression and perceptron models for binary classification.\n\n5. **Convergence**: For linearly separable data, this update rule will converge to a solution where the model perfectly classifies all training examples, assuming an appropriate learning rate \\(\\alpha\\).\n\nIn essence, the Widrow-Hoff rule adjusts weights incrementally in response to errors observed during training, thereby improving the model's predictions iteratively.",
        references: [
            {section: "23.4 Generalization in Reinforcement Learning.", pages: [854, 855, 856]},
            {section: "19.6 Linear Regression and Classification.", pages: [700, 701, 702]},
        ],
        highlight: "Widrow–Hoff rule"
    },
    { 
        id: 2, 
        text: "Por que el cielo no es violeta" ,
        answer: "Por que no",
        references: [
            {section: "Chapter 1.4 Lorem Ipsum.", pages: [2] },
            {section: "Chapter 1.5 Lorem Ipsum.", pages: [4] },
            {section: "Chapter 1.6 Lorem Ipsum.", pages: [6] },
        ],
        highlight: ""
    }
]

export default demoQuestions