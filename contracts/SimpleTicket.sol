
contract SimpleTicket{

uint  public available;
uint  public  start;
uint  public  end;
uint public  redeemby;
uint public  redeemstart;
address public Creator;
uint   public cost;
bytes32 public hash;

mapping (uint=>address ) private  keys;
mapping (address=> mapping (uint =>uint) ) private  keyown;
mapping  (uint=>bool) keyvalid;
mapping (address=>uint) private  tickets;


event Printed(
uint key,uint256 hash
);


function SimpleTicket(uint s,uint e,uint rs,uint rb,uint c,uint number){
        redeemstart=now + rs*1 days;
        redeemby=(now +rb*1 days);
	      start=now +s*1 days;
        end=now +e*1 days;
        cost=c;
        Creator=msg.sender;
        available=number;
        hash=keccak256(block.difficulty, block.coinbase, now);


}


 function  SendTicket (uint number) payable public{
    require((now>start) && (now<end));
    require(available>=number);
    require(msg.value>=number*cost);
   
    
    
   
      for(uint i=0;i<number;i++){
        
        keys[available]=msg.sender;
        keyvalid[available]=true;
        keyown[msg.sender][i+tickets[msg.sender]]=available;
        available=available-1;
      }
     tickets[msg.sender]= tickets[msg.sender]+number;
}

function  redeem(address a,uint key) public returns (bool) {
    require((now>redeemstart) && (now<redeemby));
    require(tickets[a]>0); 
    
	 if(keyvalid[key]==true){
	    tickets[a]=tickets[a]-1;
      keyvalid[key]=false;
	   return true;
	}
	else{
	   return false;
	}
}
function printTT(address a,uint i) public  view returns (bytes32,uint  ){


      
       
       return (hash,keyown[a][i]);
       
        
        
        
      
}

function listKey(address user, uint i) public view returns(uint key){
  return keyown[user][i];
}
function listTickets(address user) public view returns(uint n){
  return tickets[user];
}
function listowner(uint key) public view returns (address , bytes32){
  return (keys[key],hash);

}
}