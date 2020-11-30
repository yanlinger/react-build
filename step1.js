/**
 * 
 * step I the createElement Function
 */

// const element =(
//     <div id="foo">
//         <a>bar</a>
//         <b/>
//     </div>
//   )

//=>
// const element = React.createElment(
//     "div",
//     {id:"foo"},
//     React.createElment("a",null,"bar"),
//     React.createElment("b")
// )
//=>
function createElement(type,props,...children){
    return {
        type,
        props:{
            ...props,
            //children, =>
            children:children.map(child =>
                typeof child === "object"
                ?child
                : createTextElement(child)
            ),
        },
    }
}
/**
 * createElement("div", null, a) returns:
 * {
    "type": "div",
        "props": { "children": [a] }
}
 */
//The children array could also contain primitive values like strings or numbers. So we’ll wrap everything that isn’t an object inside its own element and create a special type for them: TEXT_ELEMENT
function createTextElement(text){
    return {
        type:"TEXT_ELEMENT",
        props:{
            nodeValue:text,
            children:[]
        }
    }
}
//=>
const element = React.createElment(
    // "div",
    // {id:"foo"},
    React.createElment("a",null,"bar"),
    React.createElment("b")
)
//=>
const Didact = {
    createElement,
    //render,
}
const element =Didact.createElment(
    // "div",
    // {id:"foo"},
    Didact.createElment("a", null, "bar"),
    Didact.createElment("b")
)

//=>
/**
 * @jsx Didact.createElement
 */
const element =(
    <div id="foo">
        <a>bar</a>
        <b/>
    </div>
)
  const container =document.getElementById("root")
  /**
   * stepII :the render Function
   */
  function render(element,container){
      //toto create dom nodes
      // 1.We start by creating the DOM node using the element type,
      //const dom =docuement.createElment(element.type);
      
      //4.We also need to handle text elements, if the element type is TEXT_ELEMENT 
      // we create a text node instead of a regular node.
      const dom = element.type =="TEXT_ELEMENT"
                    ?document.createTextNode("")
                    :document.createElement(element.type)
    
     //5.The last thing we need to do here is 
     // assign the element props to the node.
     const isProperty =key =>key !== "childen"
     Object.keys(element.pops)
     .filter(isProperty)
     .forEach(name =>{
         dom[name] = element.props[name]
     })
      //3.recursively do the same for each child
      element.props.children.forEach(child=>
        render(child,dom))
    // 2.and then append the new node to the container.
      container.appendChild(dom)
  }
 // ReactDOM.render(element,container)
