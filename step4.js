/**
 * Step IV: Fibers
 */
//To organize the units of work we’ll need a data structure: a fiber tree.
//要组织工作单元，我们需要一个数据结构：a fiber tree
//In the render we’ll create the root fiber and set it as the nextUnitOfWork. The rest of the work will happen on the performUnitOfWork function, there we will do three things for each fiber:
//在渲染中，我们将创建根 fiber并将设置为nextUnitOfWork
//剩下的工作将在performUnitOfWork函数中进行，我们将每一个fiber做三件事
/**
 * 1.add the element to the DOM 将元素添加到DOM
   2.create the fibers for the element’s children  为元素的子代创建纤维
   3.select the next unit of work 选择下一个工作单元
 */
//has a link to its first child, its next sibling and its parent.
//And if the fiber doesn’t have a child nor a sibling we go to the “uncle”: the sibling of the parent. Like a and h2 fibers from the example.
//如果光纤既没有孩子也没有兄弟姐妹，那么我们去“叔叔”：父母的兄弟姐妹。就像示例中的a和h2光纤一样。
//Also, if the parent doesn’t have a sibling, we keep going up through the parents until we find one with a sibling or until we reach the root. If we have reached the root, it means we have finished performing all the work for this render.
//另外，如果父母没有兄弟姐妹，我们会不断检查父母，直到找到有兄弟姐妹的父母，或者直到找到根。如果到达根目录，则意味着我们已经完成了此渲染的所有工作。
//1.In the render function we set nextUnitOfWork to the root of the fiber tree.
function render(element, container) {
    nextUnitOfWork = {
        dom: container,
        props: {
            children: [element],
        },
    }
}
let nextUnitOfWork = null



function workLoop(deadline) {
    //let shouldYield = false
   // while (nextUnitOfWork && !shouldYield) {
        ////2.Then, when the browser is ready,it will call our workLoop and we’ll start working on the root.
        //然后，当浏览器准备就绪时，它将调用我们的workLoop，我们将开始在根目录上工作
        nextUnitOfWork = performUnitOfWork(
            nextUnitOfWork
        )
        //shouldYield = deadline.timeRemaining() < 1
    //}
    // requestIdleCallback(workLoop)
}
function performUnitOfWork(fiber){
    //TODO add dom node
    if(!fiber.dom){
        //1.First, we create a new node and append it to the DOM.
        // We keep track of the DOM node in the fiber.dom property.
        fiber.dom = createDom(fiber)
    }
    if(fiber.parent){
        fiber.parent.dom.appendChild(fiber.dom)
    }
    //TODO create new fiber
    const elements = fiber.props.children
    let index = 0
    let prevSibling = null
    // 2.Then for each child we create a new fiber. 然后，为每个孩子创建一个新的纤维。
    while(index < element.length){
        const element = element[index]

        const newFiber = {
            type:element.type,
            props:element.props,
            parent:fiber,
            dom:null,
        }
        //And we add it to the fiber tree setting it either as a child or as a sibling, depending on whether it’s the first child or not.
        // 然后将其添加到纤维树中，将其设置为子代还是同级，具体取决于它是否是第一个子代
        if(index === 0){
            fiber.child = newFiber
        }else{
            prevSibling.sibling = newFiber
        }
        prevSibling = newFiber
        index++
    }
    //TODO return next unit of work
    //Finally we search for the next unit of work. We first try with the child, 
    // then with the sibling, then with the uncle, and so on.
    if(fiber.child){
        return fiber.child
    }
    let nextFiber = fiber
    while(nextFiber){
        if(nextFiber.sibling){
            return nextFiber.sibling
        }
        nextFiber = nextFiber.parent
    }
}
//--- And that’s our performUnitOfWork.
