import React from 'react'
import { useSelector } from 'react-redux'
import Transaction from './Transaction';
import Notauthenticated from './Notauthenticated';
function TransactionWrapper() {
    const authStatus= useSelector((state)=>state.auth.status);
    if(authStatus){
        return <Transaction/>
    }
    else{
        return <Notauthenticated/>
    }
}

export default TransactionWrapper