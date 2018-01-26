
      var hash=SimpleTicketInstance.print( { from: account});
      SimpleTicketInstance.listKey(account);

      web3.eth.sign(account, hash ,function (err, result) {
       if (err) return console.error(err)
       console.log('SIGNED:' + result)
       var ticket=mykey+result 
       var qrcode = new QRCode("qrcode");
       var q=new QRCode(document.getElementById("DisplayCode"),ticket)
       }