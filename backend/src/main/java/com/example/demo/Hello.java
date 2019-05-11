package com.example.demo;

import com.example.demo.models.Message;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
public class Hello {
    @RequestMapping(
            path="/hello",
            method= RequestMethod.GET,
            produces= {MediaType.APPLICATION_JSON_VALUE,
                    MediaType.APPLICATION_XML_VALUE})
    public Message hello (@RequestParam(name="name",
                                        required=false,
                                        defaultValue="World") String name) {
        return new Message("Hello " + name +"!");
    }


    @RequestMapping(
            path="/hello/{name}",
            method= RequestMethod.GET,
            produces= {MediaType.APPLICATION_JSON_VALUE,
                    MediaType.APPLICATION_XML_VALUE})
    public Message helloUser(@PathVariable("name") String name) {
        String response = "Hello " + name + "!";
        return new Message(response);
    }
}
