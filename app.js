
App = {
  web3Provider: null,
  contracts: {},
  
  init: function() {
 
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('SimpleTicket.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var SimpleTicketArtifact = data;
      App.contracts.SimpleTicket = TruffleContract(SimpleTicketArtifact);

      // Set the provider for our contract.
      App.contracts.SimpleTicket.setProvider(App.web3Provider);

      
      return App.getBalances();

    });

    return App.bindEvents();
  },

  bindEvents: function() {

     
     $(document).on('click', '#transferButton', App.handleTransfer);
     $(document).on('click', '#PB', App.printTicket);
     $(document).on('click', '#SB', App.Scan);
  },
 
  handleTransfer: function() {
    event.preventDefault();

    var amount = parseInt($('#TTTransferAmount').val());
   

    console.log('Transfer ' + amount + ' toAddress');

    var SimpleTicketInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
       


     
     
      App.contracts.SimpleTicket.deployed().then(function(instance) {
       SimpleTicketInstance = instance;
     
      var cost=1


      var totalcost=amount*cost
      console.log(totalcost)
      return SimpleTicketInstance.SendTicket( amount, {value: web3.toWei(totalcost.toString(), 'ether'), from: account});
      }).then(function(result) {
        alert('Transfer Successful!');
        console.log(result)
      }).catch(function(err) {
        console.log(err.message);
      });
    });
    return App.getBalances();
  },

  getBalances:function(){
     console.log('Getting balances...');

    var SimpleTicketInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.SimpleTicket.deployed().then(function(instance) {
        SimpleTicketInstance = instance;
      


        
        
      return SimpleTicketInstance.available().then(function(result) {
        var balance = result;
        $('#TTBalance').text(balance);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
    });
    return App.getCost();
  },

   getCost:function(){
   var SimpleTicketInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
       var account = accounts[0];

      App.contracts.SimpleTicket.deployed().then(function(instance) {
        SimpleTicketInstance = instance;
      return SimpleTicketInstance.cost()
      .then(function(result) {
       var cost = result;
       $('#cost').text(cost.toString());
       }).catch(function(err) {
        console.log(err.message);
      });

   });
 })
   return App.getTickets();  
},
getTickets:function(){
   var SimpleTicketInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
       var account = accounts[0];

      App.contracts.SimpleTicket.deployed().then(function(instance) {
        SimpleTicketInstance = instance;
      return SimpleTicketInstance.listTickets(account)
      .then(function(result) {
       var T= result;
       console.log(T)
       $('#TTB').text(T.toString());
       }).catch(function(err) {
        console.log(err.message);
      });

   });
 })
},
 ProcessScan:function(scan){
     web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
       var account = accounts[0];
     var key= scan.substring(0,3)
     App.contracts.SimpleTicket.deployed().then(function(instance) {
      return SimpleTicketInstance.listowner(key)
      .then(function(result) {
        console.log(result)
        var Acc=result[0]
        var hash=result[1]
        var final= web3.sha3(key+hash);
        console.log(Acc)
        console.log(hash)
        App.ReadSig(Acc,final,scan)
     
      })
     });
   });
   
 },
 ReadSig:function(account,message,hash){

  var m=message
  console.log(m)
   var from= account
   var signed=hash.substring(3,hash.length)

   console.log(signed)
    var  method = 'personal_ecRecover'
    var params = [m,signed ]
    web3.currentProvider.sendAsync({
      method,
      params,
      from,
    }, function (err, result) {
      var recovered = result.result
      console.log('ec recover called back:')
      console.dir({ err, recovered })
      if (err) return console.error(err)
      if (result.error) return console.error(result.error)


      if (recovered === from ) {

        console.log('Successfully ecRecovered signer as ' + from)
        App.Redeemm(recovered)



      } else {
        console.log('Failed to verify signer when comparing ' + result + ' to ' + from)
      }

    })



},

  Scan:function(){
   let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
      scanner.addListener('scan', function (content) {
        console.log(content);
        App.ProcessScan(content);

      });
      Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
          scanner.start(cameras[0]);
        } else {
          console.error('No cameras found.');
        }
      }).catch(function (e) {
        console.error(e);
      });


  }, 
  Redeemm:function(User){
  App.contracts.SimpleTicket.deployed().then(function(instance) {
  SimpleTicketInstance = instance;
  return SimpleTicketInstance.redeem(User).then(function(result){
  	  console.log(result)
      if(result==true){
      	console.log('Ticket Activated')
      }
      else{
      	console.log('Ticket Failed Miserably')
      }
    })
  	
   })

  },
  printTicket:function(){
    
     var N= parseInt($('#PQ').val());
      
     var SimpleTicketInstance;
     console.log('started')
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);

      }
      var account = accounts[0];
      App.contracts.SimpleTicket.deployed().then(function(instance) {
      SimpleTicketInstance = instance;

      
   
       return SimpleTicketInstance.printTT(account,N).then(function(result){
          var R=result;

          console.log(R[0]);
          console.log(R[1].c)

        hash=R[0]
        key=R[1]
        key="" + key
        

        if(key.length<3){
        	while(key.length<3){
             key=0+key
        	}	

        }
        console.log(key+hash)
        final= web3.sha3(key+hash);
        var from = account;
        var params = [final, from]
        var method = 'personal_sign'
       web3.currentProvider.sendAsync({
       method,
       params,
  	   from,
    	}, function (err, result) {
    	if (err) return console.error(err)
    	if (result.error) return console.error(result.error)
    	console.log('PERSONAL SIGNED:' +result.result)
         App.Display(result.result,key);
  
	    })

        
          
        
        }).catch(function(err) {
        console.log(err.message);
      });
        
     
     
     })
        	}
    
   
 )
},

  Display:function(sig,key){
  var message=key+sig; 
   console.log(message.substring(0,3))
  console.log(message) 
  var qrcode = new QRCode(document.getElementById("QR"), {
  text: message,
  width: 256,
  height: 256,
  colorDark : "#000000",
  colorLight : "#ffffff",
  correctLevel : QRCode.CorrectLevel.H
   });

  }

}

$(function() {
  $(window).load(function() {
    App.init();
  });
});

