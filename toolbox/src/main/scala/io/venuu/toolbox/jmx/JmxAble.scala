package io.venuu.toolbox.jmx

import java.lang.management.ManagementFactory
import javax.management.ObjectName

/**
  * Created by chris on 03/01/2016.
  */
trait JmxAble { self =>
  def name: String = this.getClass.getSimpleName

  if(JmxInfra.isJmxEnabled)
    JmxInfra.register(this)
}

object JmxInfra{

  @volatile private var enabled = false

  def enableJmx(): Unit = {
    enabled = true
  }

  def isJmxEnabled: Boolean = {
    enabled
  }

  def register(jmxAble: JmxAble) = {
    val mBeanServer = ManagementFactory.getPlatformMBeanServer();
    mBeanServer.registerMBean(jmxAble, new ObjectName("Whitebox:type="+jmxAble.name));
  }

}

