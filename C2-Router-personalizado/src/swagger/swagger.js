import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Products/Shop API",
            version: "1.0.0",
            description: "API for a products/shop application",
            contact: {
                name: "Nahuel Martin Santos",
                url: "https://nahuel-portfolio-psi.vercel.app/",
                email: "nahuelmsantos@gmail.com"
            }
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 8080}`,
                description: "Local server"
            }
        ]
    },
    apis: ["./src/swagger/*.yml"]
};

const swaggerConfig = swaggerJSDoc(options);

export default swaggerConfig;
