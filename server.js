require('dotenv').config();
const express = require('express');
const shopifyExpress = require('shopify-express-x');
const session = require('express-session');
const app = express();

const { SHOPIFY_APP_KEY, SHOPIFY_APP_HOST, SHOPIFY_APP_SECRET } = process.env;
// session is necessary for api proxy and auth verification
app.use(session({ secret: SHOPIFY_APP_SECRET }));

app.get('/', (req, res) => res.json('Hello'));

const { routes, withShop } = shopifyExpress({
  host: SHOPIFY_APP_HOST,
  apiKey: SHOPIFY_APP_KEY,
  secret: SHOPIFY_APP_SECRET,
  scope: [
    `
    read_products, 
    write_products, 
    write_orders, 
    read_content, 
    write_content, 
    read_themes, 
    write_themes
    `,
  ],
  accessMode: 'offline',
  afterAuth(request, response) {
    const {
      session: { accessToken, shop },
    } = request;
    // install webhooks or hook into your own app here
    return response.redirect('/');
  },
});

// mounts '/auth' and '/api' off of '/shopify'
app.use('/shopify', routes);

app.listen(3001, () => console.log('Server is listening on port 3001'));
