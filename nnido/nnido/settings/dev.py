from .base import *

DEBUG = True

try:
    from .local import *  # Import local settings if available
except ImportError:
    pass