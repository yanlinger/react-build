function createElement(type,props,...children){
    return {
        type,
        props:{
            ...props,
            children: children.map(child =>
                typeof child === "object"?child:createTextElement(child)
            )
        }
    };
}
function createTextElement(text){
    return {
        type:"TEXT_ELEMENT",
        props:{
            nodeValue:text,
            children:[]
        }
    };
}
function render(element,container){
    const dom =
          element.type == "TEXT_ELEMENT"
          ? document.createTextNode("")
          :document.createElement(element.type)
    const isProperty = key =>key!=="children"
    Object.keys(element.props).filter(isProperty).forEach(name =>{
        dom[name] = element.props[name];
    })
    element.props.children.forEach(child =>render(child,dom))
    container.appendChild(dom)
}
const Didact ={
    createElement,
    render
}

const element =(
    <div style="background: salmon">
        <h1>Hello World</h1>
        <h2 style="text-align:right">from Didact</h2>
    </div>
)
const container =document.getElementById("root")
Didact.render(element,container)

stop0:
//the first one defines a react element
// On the first line we have the element, defined with JSX.It isn’t even valid JavaScript, so in order to replace it with vanilla JS, first we need to replace it with valid JS.

// const element =<h1 title="foo">Hello</h1>

// const element =React.createElement(
//     "h1",
//     {title:"foo"},
//     "Hello"
// )
//=> we can safely replace the function call with its output.
const element ={
    type:"h1",//a string that specifies the type of the DOM node we want to create
    props:{// object,it has all the keys and values from the JSX attributes.
        title:"foo",
        children:"Hello",//a string or an array with more elements.that's why elements are also trees.
    },
}
//the next one gets a node from the DOM
const container =document.getElementById("root")
//the last one renders the React element into the container
/**The other piece of React code we need to replace is the call to ReactDOM.render. */
// ReactDom.render(element,container)

//First we create a node * using the element type, in this case h1.
const node = document.createElement(element.type)
//Then we assign all the element props to that node. Here it’s just the title.
node["title"] = element.props.title

//todo to avoid confusion ,i'll use "element" to refer to React elements and "node" for DOM elements.

//Then we create the nodes for the children. We only have a string as a child so we create a text node.
const text = document.createTextNode("")
//Using textNode instead of setting innerText will allow us to treat all elements in the same way later.Note also how we set the nodeValue like we did it with the h1 title, it’s almost as if the string had props:
text["nodeValue"] = element.props.children

//Finally, we append the textNode to the h1 and the h1 to the container.
node.appendChild(text)
container.appendChild(node)
