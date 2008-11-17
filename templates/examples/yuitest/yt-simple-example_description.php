<h2 class="first">Simple Test Example</h2>

<p>This example begins by creating a namespace:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.namespace("example.yuitest");  
</textarea>
<p>This namespace serves as the core object upon which others will be added (to prevent creating global objects).</p>

<h3>Creating the first TestCase</h3>

<p>The first step is to create a new <a href="/yui/yuitest/#testcase"><code>TestCase</code></a> object called <code>DataTestCase</code>.
  To do so, using the <code>TestCase</code> constructor and pass in an object literal containing information about the tests to be run:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.example.yuitest.DataTestCase = new YAHOO.tool.TestCase({

    //name of the test case - if not provided, one is auto-generated
    name : "Data Tests",
    
    //---------------------------------------------------------------------
    // setUp and tearDown methods - optional
    //---------------------------------------------------------------------
    
    /*
     * Sets up data that is needed by each test.
     */
    setUp : function () {
        this.data = {
            name: "yuitest",
            year: 2007,
            beta: true
        };
    },
    
    /*
     * Cleans up everything that was created by setUp().
     */
    tearDown : function () {
        delete this.data;
    },
    
    //---------------------------------------------------------------------
    // Test methods - names must begin with "test"
    //---------------------------------------------------------------------
    
    testName : function () {
        var Assert = YAHOO.util.Assert;
        
        Assert.isObject(this.data);
        Assert.isString(this.data.name);
        Assert.areEqual("yuitest", this.data.name);            
    },
    
    testYear : function () {
        var Assert = YAHOO.util.Assert;
        
        Assert.isObject(this.data);
        Assert.isNumber(this.data.year);
        Assert.areEqual(2007, this.data.year);            
    },
    
    testBeta : function () {
        var Assert = YAHOO.util.Assert;
        
        Assert.isObject(this.data);
        Assert.isBoolean(this.data.beta);
        Assert.isTrue(this.data.beta);
    }

});
</textarea>  
<p>The object literal passed into the constructor contains a number of different sections. The first section contains the <code>name</code> property,
  which is used to determine which <code>TestCase</code> is being executed. A name is necessary, so one is generated if it isn't specified.</p>
<p>Next, the <code>setUp()</code> and <code>tearDown()</code> methods are included. The <code>setUp()</code> method is used in a <code>TestCase</code>
  to set up data that may be needed for tests to be completed. This method is called immediately before each test is executed. For this example,
  <code>setUp()</code> creates a data object. The <code>tearDown()</code> is responsible for undoing what was done in <code>setUp()</code>. It is
  run immediately after each test is run and, in this case, deletes the data object that was created by <code>setUp</code>. These methods are optional.</p>
<p>The last section contains the actual tests to be run. Test method names must always begin with the word &quot;test&quot; (all lowercase) in order
  to differentiate them from other methods that may be added to the object.</p>
<p>The first test in this object is <code>testName()</code>, which runs
  various assertions on <code>data.name</code>. Inside of this method, a shortcut to <code>YAHOO.util.Assert</code> is set up and used to run three
  assertions: <code>isObject()</code> on <code>data</code>, <code>isString()</code> on <code>data.name</code> and <code>areEqual()</code> to compare
  <code>data.name</code> to the expected value, &quot;yuitest&quot;. These assertions are arranged in order from least-specific to most-specific,
  which is the recommended way to arrange your assertions. Basically, the third assertion is useless to run unless the second has passes and the second
  can't possibly pass unless the first passed. Both <code>isObject()</code> and <code>isString()</code> accept a single argument, which is the value
  to test (you could optionally include a failure message as a second argument, though this is not required). The <code>areEqual()</code> method
  expects two arguments, the first being the expected value (&quot;yuitest&quot;) and the second being the actual value (<code>data.name</code>).</p>
<p>The second and third tests follow the same pattern as the first with the exception that they work with different data types. The <code>testYear()</code>
  method works with <code>data.year</code>, which is a number and so runs tests specifically for numbers (<code>areEqual()</code> can be used with
  all data types). The <code>testBeta()</code> method works with <code>data.beta</code>, which is a Boolean, and so it uses the <code>isTrue()</code>
  assertion instead of <code>areEqual()</code> (though it could also use <code>areEqual(true, this.data.beta)</code>).</p>
 
 <h3>Creating the second TestCase</h3>
 
 <p>Although it's possible that you'll have only one <code>TestCase</code> object, typically there is more than one, and so this example includes
   a second <code>TestCase</code>. This one tests some of the built-in functions of the <code>Array</code> object:</p>
 <textarea name="code" class="JScript" cols="60" rows="1">
 YAHOO.example.yuitest.ArrayTestCase = new YAHOO.tool.TestCase({

    //name of the test case - if not provided, one is auto-generated
    name : "Array Tests",
    
    //---------------------------------------------------------------------
    // setUp and tearDown methods - optional
    //---------------------------------------------------------------------
    
    /*
     * Sets up data that is needed by each test.
     */
    setUp : function () {
        this.data = [0,1,2,3,4]
    },
    
    /*
     * Cleans up everything that was created by setUp().
     */
    tearDown : function () {
        delete this.data;
    },
    
    //---------------------------------------------------------------------
    // Test methods - names must begin with "test"
    //---------------------------------------------------------------------
    
    testPop : function () {
        var Assert = YAHOO.util.Assert;
        
        var value = this.data.pop();
        
        Assert.areEqual(4, this.data.length);
        Assert.areEqual(4, value);            
    },        
    
    testPush : function () {
        var Assert = YAHOO.util.Assert;
        
        this.data.push(5);
        
        Assert.areEqual(6, this.data.length);
        Assert.areEqual(5, this.data[5]);            
    },
    
    testSplice : function () {
        var Assert = YAHOO.util.Assert;
        
        this.data.splice(2, 1, 6, 7);
        
        Assert.areEqual(6, this.data.length);
        Assert.areEqual(6, this.data[2]);           
        Assert.areEqual(7, this.data[3]);           
    }

});  
 </textarea>
 <p>As with the first <code>TestCase</code>, this one is split up into three sections: the name, the <code>setUp()</code> and <code>tearDown()</code> 
  methods, and the test methods. The <code>setUp()</code> method in this <code>TestCase</code> creates an array of data to be used by the various
  tests while the <code>tearDown()</code> method destroys the array. The test methods are very simple, testing the <code>pop()</code>, <code>push()</code>,
  and <code>splice()</code> methods. Each test method uses <code>areEqual()</code> exclusively, to show the different ways that it can be used.
  The <code>testPop()</code> method calls <code>pop()</code> on the array of values, then verifies that the length of the array has changed and
  that the value popped off is 4; the <code>testPush()</code> pushes a new value (5) onto the array and then verifies that the length of the array has
  changed and that the value is included in the correct location; the <code>testSplice()</code> method tests  <code>splice()</code> by removing one
  value that's already in the array and inserting two in its place.</p>
  
<h3>Creating the TestSuite</h3>
<p>To better organize the two <code>TestCase</code> objects, a <code>TestSuite</code> is created and those two <code>TestCase</code> objects are
  added to it:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.example.yuitest.ExampleSuite = new YAHOO.tool.TestSuite("Example Suite");
YAHOO.example.yuitest.ExampleSuite.add(YAHOO.example.yuitest.DataTestCase);
YAHOO.example.yuitest.ExampleSuite.add(YAHOO.example.yuitest.ArrayTestCase);
</textarea> 
<p>The first line creates a new <code>TestSuite</code> object using its constructor, which accepts a single argument - the name of the suite. As with
  the name of a <code>TestCase</code>, the <code>TestSuite</code> name is used to determine where execution is when tests are being executed. Although
  not required (one is generated if it's not provided), it is recommended that you select a meaningful name to aid in debugging.</p>
<p>Any number of <code>TestCase</code> and <code>TestSuite</code> objects can be added to a <code>TestSuite</code> by using the <code>add()</code>
  method. In this example, the two <code>TestCase</code> objects created earlier are added to the <code>TestSuite</code>.</p>
  
<h3>Running the tests</h3>

<p>With all of the tests defined, the last step is to run them. This initialization is assigned to take place when the document tree has been 
  completely loaded by using the Event utility's <code>onDOMReady()</code> method:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.util.Event.onDOMReady(function (){

    //create the logger
    var logger = new YAHOO.tool.TestLogger();
    
    //add the test suite to the runner's queue
    YAHOO.tool.TestRunner.add(YAHOO.example.yuitest.ExampleSuite);

    //run the tests
    YAHOO.tool.TestRunner.run();
});
</textarea> 

<p>Before running the tests, it's necessary to create a <code>TestLogger</code> object to display the results (otherwise the tests would run 
  but you wouldn't see the results). After that, the <code>TestRunner</code> is loaded with the <code>TestSuite</code> object by calling 
  <code>add()</code> (any number of <code>TestCase</code> and <code>TestSuite</code> objects can be added to a <code>TestRunner</code>, 
  this example only adds one for simplicity). The very last step is to call <code>run()</code>, which begins executing the tests in its
  queue and displays the results in the <code>TestLogger</code>.</p>