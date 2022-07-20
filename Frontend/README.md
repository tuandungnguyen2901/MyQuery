# Front-end

## API endpoints

- /forms : homepage, display all the forms
- /forms/:id : display the form and edit
- /forms/:id#responses=responsesId : display the response of the form

## Tech used

- React Query (maybe?)
- Material Design (MUI)
- React router dom (v6)

## API E-wallet backend nodejs

- port: http://localhost:5001/
- create wallet:
  + method: post
  + endpoint: /api/ewallet/userWallet
  + authorizarion: `Bearer ${token}`
  + response?.data: {
      id,
      userId,
      balance
    }
  
- get balance:
  + method: get
  + endpoint: /api/ewallet/userWallet
  + authorizarion: `Bearer ${token}`
  + response?.data: balance: number

- charge money
  + method: post
  + endpoint: /api/ewallet/userWallet/charge
  + authorizarion: `Bearer ${token}`
  + body: {
    amount: number
  }
  + response?.data: {
    id,
    userId,
    balance
  }

- pay money:
  + method: post
  + endpoint: /api/ewallet/userWallet/pay
  + authorizarion: `Bearer ${token}`
  + body: {
    amount: number
  }
  + response?.data: {
    id,
    userId,
    balance
  }

- Use try catch to handle error, get error message by: error?.response?.data?.msg