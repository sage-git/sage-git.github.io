var kB = 1.0;

var IsingModel = function(){
  this.nodes = [];
  this.J = [];
  this.connect = [];
}

IsingModel.prototype.setNodes = function(args){
    // arguments:
  //   nnode [integer] -
  //   H_interaction [number] - parameter p of the interaction for Hi = p*E*si
    this.n = args.nnode;
  this.Hint = args.H_interaction;
  for(var i = 0; i < this.n; i++){
    this.nodes[i] = {spin: (Math.round(Math.random()) == 0)? -1: 1, delta_H: 0.0, edges: [], neighbors:[]};
  }
  return this;
}

IsingModel.prototype.setInteraction = function(args){
  //   J_interaction [list of number] - [Jij, Jik, Jjk, .... ]
  //   J_list     [list of pair list] - [[i, j], [i, k], [j, k], ....]
  this.n_interact = args.J_interaction.length;

  for(var i = 0; i < this.n_interact; ++i){
    this.J[i] = args.J_interaction[i];
    var n1 = args.J_list[i][0];
    var n2 = args.J_list[i][1];
    // contains reference to corresponding elements of this.nodes
    this.connect[i] = [n1, n2];
    this.nodes[n1].edges.push(i);
    this.nodes[n2].edges.push(i);
    this.nodes[n1].neighbors.push(n2);
    this.nodes[n2].neighbors.push(n1);
  }
  return this;
}

IsingModel.prototype.setExternal = function(args){
  this.H = args.External_H;
  this.T = args.temperature;
  this.Beta = 1.0/(this.T*kB);
  return this;
}

IsingModel.prototype.getEnergy = function(){
  var H0 = 0.;
  for(var i = 0; i < this.n; i++){
    H0 += this.nodes[i].spin*this.Hint*this.H;
  }
  for(var i = 0; i < this.n_interact; i++){
    var pair = this.connect[i];
    var n1 = this.nodes[pair[0]];
    var n2 = this.nodes[pair[1]];
    H0 += this.J[i]*n1.spin*n2.spin;
  }
  return H0;
}

IsingModel.prototype.Reset = function(){
  for(var i = 0; i < this.n; ++i){
    this.nodes[i].spin = (Math.round(Math.random()) == 0)? -1: 1;
  }
  return this;
}

IsingModel.prototype.step = function(){
  for(var i = 0|0; i < this.n; i = i + 1){
    var node = this.nodes[i];
    var nn = node.edges.length;
    node.delta_H =  + 2.0*node.spin*this.Hint*this.H;
    for(var j = 0; j < nn; j++){
      node.delta_H += this.J[node.edges[j]]*node.spin*this.nodes[node.neighbors[j]].spin;
    }
    if(node.delta_H < 0.0){
      node.spin = -node.spin;
    }else{
      var pb = Math.exp( - node.delta_H*this.Beta)*0.5;
      if(pb > Math.random()){
        node.spin = -node.spin;
      }
    }
  }
  return this;
}

IsingModel.prototype.getState = function(){
  var retArray = [];
  for(var i = 0; i < this.n; i++){
    retArray[i] = this.nodes[i].spin;
  }
  return retArray;
}

IsingModel.prototype.setTemperature = function(T){
  this.T = T;
  this.Beta = 1.0/(this.T*kB);
}
IsingModel.prototype.setExternalH = function(H){
  this.H = H;
}
IsingModel.prototype.reset_J_values = function(Js){
  for(var i = 0; i < this.n_interact; i++){
    this.J[i] = Js[i];
  }
}
/*
var test = new IsingModel();
test.setNodes({nnode: 3, H_interaction:1.});
test.setInteraction({J_interaction: [0.1, 0.1, 0.1], J_list: [[0,1], [0,2], [1, 2]]});
test.setExternal({External_H: 1.0, temperature:1.});
for(var istep = 0; istep < 10; istep++){
  test.step();
  console.log(test.getState());
  console.log(test.getEnergy());
}
*/
