/**
 * Step III: Concurrent Mode
 */
//Once we start rendering, we won’t stop until we have rendered the complete element tree. If the element tree is big, it may block the main thread for too long. And if the browser needs to do high priority stuff like handling user input or keeping an animation smooth, 
// it will have to wait until the render finishes.

//So we are going to break the work into small units,
// and after we finish each unit we’ll let the browser interrupt the rendering if there’s anything else that needs to be done.
//我们将把工作分成几个小部分，
// 在完成每个单元后，如果需要执行其他任何操作，我们将让浏览器中断渲染。
let nextUnitOfWork = null
function workLoop(deadline){
    let shouldYield = false
    while(nextUnitOfWork && !shouldYield){
        nextUnitOfWork = performUnitOfWork(
            nextUnitOfWork
        )
        shouldYield = deadline.timeRemaining() < 1
    }
    //使用requestIdleCallback来进行循环，requestIdleCallback视为setTimeout
    //浏览器将在主线程空间时运行回调
    //React doesn’t use requestIdleCallback anymore.
    // Now it uses the scheduler package. But for this use case it’s conceptually the same.
    requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)
//To start using the loop we’ll need to set the first unit of work,
// and then write a performUnitOfWork function that not only performs the work but also returns the next unit of work.
//
//要开始使用循环，我们需要设置第一个工作单元，然后编写一个performUnitOfWork函数，该函数不仅执行工作，还返回下一个工作单元。
function performUnitOfWork(nextUnitOfWork){
    //TODO
}
