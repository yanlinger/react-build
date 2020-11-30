// Step V: Render and Commit Phases
// We have another problem here.

// We are adding a new node to the DOM each time we work on an element.And, remember, the browser could interrupt our work before we finish rendering the whole tree.
// In that case, the user will see an incomplete UI.And we don’t want that.
// 每次处理元素时，我们都会向DOM添加一个新节点。而且，请记住，在完成渲染整个树之前，浏览器可能会中断我们的工作。在这种情况下，用户将看到不完整的UI。而且我们不想要那样。
function render(element, container) {
    winRoot = {
        dom: container,
        props: {
            children: [element],
        },
        alternate:currentRoot,  
    }
    deletions = []//4.So we need an array to keep track of the nodes we want to remove.需要一个数组来跟踪要删除的节点。
    nextUnitOfWork = winRoot
}
//Instead, we’ll keep track of the root of the fiber tree.
// We call it the work in progress root or wipRoot.
//相反，我们将跟踪纤维树的根。我们称其为进行中的工作根或wipRoot。
let nextUnitOfWork = null
let winRoot = null
let deletions = null

//And once we finish all the work (we know it because there isn’t a next unit of work) we commit the whole fiber tree to the DOM.
//一旦完成所有工作（因为没有下一个工作单元，我们就知道了），我们便将整个光纤树提交给DOM

//We do it in the commitRoot function. Here we recursively append all the nodes to the dom
//我们在commitRoot函数中做到这一点。在这里，我们将所有节点递归附加到dom
function commitRoot(){
    //5. commiting the changes to the DOM, we also use the fibers from that array.
    //我们将更改提交到DOM时，我们还使用该阵列中的光纤。
    deletions.forEach(commitWork)
    commitWork(wipRoot.child)
    wipRoot =null
}
function commitWork(fiber){
    if(!fiber){
        return 
    }
    const domParent = fiber.parent.dom
    //6.Now, let’s change the commitWork function to handle the new effectTags.
    //让我们更改commitWork函数以处理新的effectTag。
    if(fiber.effectTag === "PLACEMENT" &&
     fiber.dom != null){
         //If the fiber has a PLACEMENT effect tag we do the same as before, append the DOM node to the node from the parent fiber.
        // 如果光纤具有PLACEMENT效果标签，则与之前相同，将DOM节点附加到父光纤的节点上。
        domParent.appendChild(fiber.dom)
     }else if(fiber.effectTag === "UPDATE" &&
           fiber.dom != null){
               //And if it’s an UPDATE, we need to update the existing DOM node with the props that changed.
               //如果是UPDATE，我们需要使用更改的道具来更新现有的DOM节点。
               updateDom(
                   fiber.dom,
                   fiber.alternate.props,
                   fiber.props)

     }else if(fiber.effectTag === "DELETION"){
         //If it’s a DELETION, we do the opposite, remove the child.
         //如果是DELETION，请执行相反的操作，删除该孩子。
         domParent.removeChild(fiber.dom)
     }
    
    commitWork(fiber.child)
    commitWork(fiber.sibling)
}

//Step VI: Reconciliation 和解
//That’s what we are going to do now, 
//we need to compare the elements we receive on the render function to the last fiber tree we committed to the DOM.
//这就是我们现在要做的，我们需要将在render函数上收到的元素与我们提交给DOM的最后一棵纤维树进行比较。

//在完成提交之后，我们需要保存对“我们提交给DOM的最后一棵纤维树”的引用。我们称它为currentRoot
// currentRoot
//在每个fiber上添加alternate属性，通过alternate属性将old fiber连接起来
//old fiber就是上一次提交阶段提交该DOM的fiber

// 1.Now let’s extract the code from performUnitOfWork that creates the new fibers…
function performUnitOfWork(fiber){
    //TODO add dom node
    // if (!fiber.dom) {
    //     //1.First, we create a new node and append it to the DOM.
    //     // We keep track of the DOM node in the fiber.dom property.
    //     fiber.dom = createDom(fiber)
    // }
    const elements = fiber.props.children
    reconcileChildren(fiber,elements)
    // if (fiber.parent) {
    //     fiber.parent.dom.appendChild(fiber.dom)
    // }
    // //TODO create new fiber
    // const elements = fiber.props.children
    // let index = 0
    // let prevSibling = null
    // // 2.Then for each child we create a new fiber. 然后，为每个孩子创建一个新的纤维。
    // while (index < element.length) {
    //     const element = element[index]

    //     const newFiber = {
    //         type: element.type,
    //         props: element.props,
    //         parent: fiber,
    //         dom: null,
    //     }
    //     //And we add it to the fiber tree setting it either as a child or as a sibling, depending on whether it’s the first child or not.
    //     // 然后将其添加到纤维树中，将其设置为子代还是同级，具体取决于它是否是第一个子代
    //     if (index === 0) {
    //         fiber.child = newFiber
    //     } else {
    //         prevSibling.sibling = newFiber
    //     }
    //     prevSibling = newFiber
    //     index++
    // }
    // //TODO return next unit of work
    // //Finally we search for the next unit of work. We first try with the child, 
    // // then with the sibling, then with the uncle, and so on.
    // if (fiber.child) {
    //     return fiber.child
    // }
    // let nextFiber = fiber
    // while (nextFiber) {
    //     if (nextFiber.sibling) {
    //         return nextFiber.sibling
    //     }
    //     nextFiber = nextFiber.parent
    // }
}

//2.…to a new reconcileChildren function.
function reconcileChildren(wipFiber,elements){
    //Here we will reconcile the old fibers with the new elements.
    let index =0
    let oldFiber = 
          wipFiber.alternate && wipFiber.alternate.child
    let prevSibling = null
    //我们同时遍历旧纤维的子级（wipFiber.alternate）和要调和的元素数组。
    while(index < element.length || 
        oldFiber !=null){
            const element = elements[index]
            let newFiber = null

            //TODO compare oldFiber to element
            const sameType = 
                  oldFiber &&
                  element &&
                  element.type == oldFiber.type
        //类型比较
        //1)if the old fiber and the new element have the same type, we can keep the DOM node and just update it with the new props
        //2)if the type is different and there is a new element, it means we need to create a new DOM node
        //3)and if the types are different and there is an old fiber, we need to remove the old node
        // 如果旧的光纤和新的元素具有相同的类型，我们可以保留DOM节点并仅使用新的道具进行更新
        // 如果类型不同并且有一个新元素，则意味着我们需要创建一个新的DOM节点
        // 如果类型不同且有旧光纤，则需要删除旧节点
        // 1.When the old fiber and the element have the same type, we create a new fiber keeping the DOM node from the old fiber and the props from the element
        // 当old fiber和元素具有相同的类型时，我们将创建new fiber，以使DOM节点与旧的纤维保持一致，而props与元素的保持一致。
        if(sameType){
                //TODO update the node 
                newFiber = {
                    type:oldFiber.type,
                    props:element.props,
                    dom:oldFiber.dom,
                    parent:wipFiber,
                    alternate:oldFiber,
                    effectTag:"UPDATE",//add a new property to the fiber ,during the commit phase ,use this property
                }
            }
        //2.Then for the case where the element needs a new DOM node we tag the new fiber with the PLACEMENT effect tag.
        // 然后，对于元素需要新DOM节点的情况，我们使用PLACEMENT效果标签来标记新的光纤
        if(element && !sameType){
            //TODO delete the oldFiber's node
            newFiber ={
                type:element.type,
                props:element.props,
                dom:null,
                parent:wipFiber,
                alternate:null,
            }
        }
        //3.And for the case where we need to delete the node, we don’t have a new fiber so we add the effect tag to the old fiber.
        // 对于需要删除节点的情况，我们没有新的光纤，因此我们将效果标签添加到旧光纤。
        if(oldFiber && !sameType){
            oldFiber.effectTag ="DELETION"
            deletions.push(oldFiber)
        }
        //when we commit the fiber tree to the DOM we do it from the work in progress root, 
        // which doesn’t have the old fibers.
        // 但是，当我们将光纤树提交给DOM时，我们是从正在进行的根目录开始的，它没有旧的光纤。
            if(oldFiber){
                oldFiber = oldFiber.sibling
            }
        }

}

//8.One special kind of prop that we need to update are event listeners, so if the prop name starts with the “on” prefix we’ll handle them differently.
//我们需要更新的一种特殊的道具是事件监听器，因此，如果道具名称以“ on”前缀开头，我们将以不同的方式处理它们
const isEvent = key =>key.startsWith("on")
const isProperty = key => key !=="children" && !isEvent(key)
const isProperty = key =>key !== "children"
const isNew =(prev,next) =>key =>
prev[key] !== next[key]
const isGone =(prev,next) =>key =>!(key in next)
//7.updateDom
//We compare the props from the old fiber to the props of the new fiber, remove the props that are gone, and set the props that are new or changed
// 我们将旧光纤的道具与新光纤的道具进行比较，移除已消失的道具，并设置新的或更改的道具
function updateDom(dom,prevProps,nextProps){

    // 9.If the event handler changed we remove it from the node.
    //remove old or changed event listeners
    Object.keys(prevProps)
        .filter(isEvent)
        .filter(
            key =>
            !(key in nextProps) || isNew(prevProps,nextProps)(key) 
        )
        .forEach(name => {
            const  eventType = name
                .toLocaleLowerCase()
                .substring(2)
            dom.removeEventListener(
                eventType,prevProps[name]
            )
        })

   

    //8.TODO remove old properties
    Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps,nextProps))
    .forEach(name =>{
        dom[name] =""
    })
    //set new or changed properties
    Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps,nextProps))
    .forEach(name =>{
        dom[name] = nexrProps[name]
    })

     //10.And then we add the new handler.
     //add event listeners
     Object.keys(nextProps)
     .filter(isEvent)
     .filter(isNew(prevProps,nextProps))
     .forEach(name =>{
          const eventType = name.toLocaleLowerCase().substring(2)
          dom.addEventListener(eventType,nextProps[name]
      )
     }) 
}

/**
 * Step VII: Function Components
 */
The next thing we need to add is support for function components.

First let’s change the example.We’ll use this simple function component, that returns an h1 element.

Note that if we transform the jsx to js, it will be:

function App(props) {
    return Didact.createElement(
        "h1",
        null,
        "Hi ",
        props.name
    )
}
const element = Didact.createElement(App, {
    name: "foo",
})
Function components are differents in two ways:

the fiber from a function component doesn’t have a DOM node
and the children come from running the function instead of getting them directly from the props
We check if the fiber type is a function, and depending on that we go to a different update function.

In updateHostComponent we do the same as before.

And in updateFunctionComponent we run the function to get the children.

For our example, here the fiber.type is the App function and when we run it, it returns the h1 element.

    Then, once we have the children, the reconciliation works in the same way, we don’t need to change anything there.

What we need to change is the commitWork function.

Now that we have fibers without DOM nodes we need to change two things.

    First, to find the parent of a DOM node we’ll need to go up the fiber tree until we find a fiber with a DOM node.

And when removing a node we also need to keep going until we find a child with a DOM node.

Step VIII: Hooks
Last step.Now that we have function components let’s also add state.

    Let’s change our example to the classic counter component.Each time we click it, it increments the state by one.

Note that we are using Didact.useState to get and update the counter value.

Here is where we call the Counter function from the example.And inside that function we call useState.

We need to initialize some global variables before calling the function component so we can use them inside of the useState function.

First we set the work in progress fiber.

We also add a hooks array to the fiber to support calling useState several times in the same component.And we keep track of the current hook index.

When the function component calls useState, we check if we have an old hook.We check in the alternate of the fiber using the hook index.

If we have an old hook, we copy the state from the old hook to the new hook, if we don’t we initialize the state.

Then we add the new hook to the fiber, increment the hook index by one, and return the state.

useState should also return a function to update the state, so we define a setState function that receives an action(for the Counter example this action is the function that increments the state by one).

We push that action to a queue we added to the hook.

And then we do something similar to what we did in the render function, set a new work in progress root as the next unit of work so the work loop can start a new render phase.

But we haven’t run the action yet.

We do it the next time we are rendering the component, we get all the actions from the old hook queue, and then apply them one by one to the new hook state, so when we return the state it’s updated.

And that’s all.We’ve built our own version of React.

You can play with it on codesandbox or github.

    Epilogue
Besides helping you understand how React works, one of the goals of this post is to make it easier for you to dive deeper in the React codebase.That’s why we used the same variable and function names almost everywhere.

For example, if you add a breakpoint in one of your function components in a real React app, the call stack should show you:

workLoop
performUnitOfWork
updateFunctionComponent
We didn’t include a lot of React features and optimizations.For example, these are a few things that React does differently:

In Didact, we are walking the whole tree during the render phase.React instead follows some hints and heuristics to skip entire sub - trees where nothing changed.
We are also walking the whole tree in the commit phase.React keeps a linked list with just the fibers that have effects and only visit those fibers.
Every time we build a new work in progress tree, we create new objects for each fiber.React recycles the fibers from the previous trees.
When Didact receives a new update during the render phase, it throws away the work in progress tree and starts again from the root.React tags each update with an expiration timestamp and uses it to decide which update has a higher priority.
And many more…
There are also a few features that you can add easily:

use an object for the style prop
flatten children arrays
useEffect hook
reconciliation by key
If you add any of these or other features to Didact send a pull request to the GitHub repo, so others can see it.

Thanks for reading!

And if you want to comment, like or share this post you can use this tweet:

/** @jsx Didact.createElement */
function App(props) {
    return <h1>Hi {props.name}</h1>
}
const element = <App name="foo" />
const container = document.getElementById("root")
Didact.render(element, container)

function performUnitOfWork(fiber) {
    if (!fiber.dom) {
        fiber.dom = createDom(fiber)
    }

    const elements = fiber.props.children
    reconcileChildren(fiber, elements)
