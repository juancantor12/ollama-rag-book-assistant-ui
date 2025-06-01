const demoQuestions = [
    { 
        id: 0, 
        text: "" ,
        answer: "",
        references: []
    },
    { 
        id: 1, 
        text: "Por que el cielo es azul?" ,
        answer: "Por que sí",
        references: [
            {section: "Chapter 1.4 Lorem Ipsum.", page: 1},
            {section: "Chapter 1.4 Lorem Ipsum.", page: 3},
            {section: "Chapter 1.5 Lorem Ipsum.", page: 5},
        ]
    },
    { 
        id: 2, 
        text: "Por que el cielo no es violeta" ,
        answer: "Por que no",
        references: [
            {section: "Chapter 1.4 Lorem Ipsum.", page: 2 },
            {section: "Chapter 1.5 Lorem Ipsum.", page: 4 },
            {section: "Chapter 1.6 Lorem Ipsum.", page: 6 },
        ]
    }
]

export default demoQuestions