class Link{
    constructor(bodyA,bodyB){
        var lastLink = bodyA.body.bodies.length - 2;
        this.constraint = Constraint.create({
            bodyA: bodyA.body.bodies[lastLink],
            bodyB: bodyB,
            length: -10,
            stiffness: 0.1
        })
        World.add(engine.world,this.constraint);
    }
    detach(){
        World.remove(engine.world,this.constraint);
    }
}